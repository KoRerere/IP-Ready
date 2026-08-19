<script setup lang="ts">
import * as THREE from 'three'

const container = ref<HTMLDivElement | null>(null)

let cleanup: (() => void) | undefined

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = src
  })
}

onMounted(async () => {
  const host = container.value
  if (!host) return

  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' })
  } catch {
    host.classList.add('dotted-globe-fallback')
    return
  }

  renderer.setClearColor(0xffffff, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.domElement.setAttribute('aria-hidden', 'true')
  host.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 10)
  camera.position.z = 2.35

  const globe = new THREE.Group()
  globe.position.y = -0.58
  globe.scale.setScalar(1.12)
  globe.rotation.set(-0.05, -1.83, 0.02)
  scene.add(globe)

  const occluder = new THREE.Mesh(
    new THREE.SphereGeometry(0.995, 64, 48),
    new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true }),
  )
  occluder.renderOrder = 0
  globe.add(occluder)

  try {
    const textureImage = await loadImage('/assets/earth-land-texture.jpg')
    const samplingCanvas = document.createElement('canvas')
    samplingCanvas.width = 1024
    samplingCanvas.height = 512
    const context = samplingCanvas.getContext('2d', { willReadFrequently: true })
    if (!context) throw new Error('Canvas is unavailable')
    context.drawImage(textureImage, 0, 0, samplingCanvas.width, samplingCanvas.height)
    const pixels = context.getImageData(0, 0, samplingCanvas.width, samplingCanvas.height).data
    const positions: number[] = []

    for (let latitude = -82; latitude <= 82; latitude += 1.35) {
      const latitudeRadians = THREE.MathUtils.degToRad(latitude)
      const longitudeStep = 1.35 / Math.max(0.32, Math.cos(latitudeRadians))

      for (let longitude = -180; longitude < 180; longitude += longitudeStep) {
        const imageX = Math.min(samplingCanvas.width - 1, Math.floor(((longitude + 180) / 360) * samplingCanvas.width))
        const imageY = Math.min(samplingCanvas.height - 1, Math.floor(((90 - latitude) / 180) * samplingCanvas.height))
        const pixelIndex = (imageY * samplingCanvas.width + imageX) * 4
        const red = pixels[pixelIndex]!
        const green = pixels[pixelIndex + 1]!
        const blue = pixels[pixelIndex + 2]!
        const saturation = Math.max(red, green, blue) - Math.min(red, green, blue)
        const isLand = red > 24 && red > blue * 1.04 && green > blue * .9 && saturation > 10
        if (!isLand) continue

        const longitudeRadians = THREE.MathUtils.degToRad(longitude)
        const radius = 1.006
        positions.push(
          radius * Math.cos(latitudeRadians) * Math.sin(longitudeRadians),
          radius * Math.sin(latitudeRadians),
          radius * Math.cos(latitudeRadians) * Math.cos(longitudeRadians),
        )
      }
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthTest: true,
      depthWrite: false,
      uniforms: { uPointSize: { value: 0.014 } },
      vertexShader: `
        uniform float uPointSize;
        varying float vFacing;

        void main() {
          vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
          vec3 transformedNormal = normalize(normalMatrix * normalize(position));
          vFacing = clamp(transformedNormal.z, 0.0, 1.0);
          gl_Position = projectionMatrix * modelViewPosition;
          gl_PointSize = uPointSize * 220.0 / max(0.35, -modelViewPosition.z);
        }
      `,
      fragmentShader: `
        varying float vFacing;

        void main() {
          float distanceFromCenter = distance(gl_PointCoord, vec2(0.5));
          if (distanceFromCenter > 0.5) discard;
          float circleEdge = 1.0 - smoothstep(0.36, 0.5, distanceFromCenter);
          float facingOpacity = mix(0.04, 0.92, smoothstep(0.02, 0.84, vFacing));
          gl_FragColor = vec4(vec3(0.153, 0.651, 0.29), circleEdge * facingOpacity);
        }
      `,
    })

    const landPoints = new THREE.Points(geometry, material)
    landPoints.renderOrder = 1
    globe.add(landPoints)

    let frame = 0
    let inView = true
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const clock = new THREE.Clock()

    const render = () => {
      const delta = Math.min(clock.getDelta(), 0.05)
      if (!reducedMotion && inView && !document.hidden) globe.rotation.y += delta * 0.065
      renderer.render(scene, camera)
      frame = requestAnimationFrame(render)
    }

    const resize = () => {
      const width = Math.max(1, host.clientWidth)
      const height = Math.max(1, host.clientHeight)
      renderer.setSize(width, height, false)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.render(scene, camera)
    }

    const resizeObserver = new ResizeObserver(resize)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = Boolean(entry?.isIntersecting)
    })
    resizeObserver.observe(host)
    visibilityObserver.observe(host)
    resize()
    render()

    cleanup = () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      geometry.dispose()
      material.dispose()
      occluder.geometry.dispose()
      ;(occluder.material as THREE.Material).dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  } catch {
    renderer.dispose()
    renderer.domElement.remove()
    host.classList.add('dotted-globe-fallback')
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="container" class="dotted-globe"></div>
</template>
