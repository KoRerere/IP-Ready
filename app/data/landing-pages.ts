import chatgptRaw from '~/content/landing/chatgpt-ip-check.md?raw'
import claudeRaw from '~/content/landing/claude-ip-check.md?raw'
import amazonRaw from '~/content/landing/amazon-ip-check.md?raw'
import ebayRaw from '~/content/landing/ebay-ip-check.md?raw'
import binanceRaw from '~/content/landing/binance-ip-check.md?raw'
import { parseLandingMarkdown, type LandingPageCopy } from '~/utils/landing-markdown'

export interface LandingPageDefinition {
  slug: string
  platform: string
  icon: string
  copy: LandingPageCopy
}

export const landingPages: Record<string, LandingPageDefinition> = {
  chatgpt: { slug: 'chatgpt-ip-check', platform: 'ChatGPT', icon: '/assets/icons/platform/IP_ic_chatgpt.svg', copy: parseLandingMarkdown(chatgptRaw) },
  claude: { slug: 'claude-ip-check', platform: 'Claude', icon: '/assets/icons/platform/IP_ic_claude.svg', copy: parseLandingMarkdown(claudeRaw) },
  amazon: { slug: 'amazon-ip-check', platform: 'Amazon', icon: '/assets/icons/platform/IP_ic_Amazon.svg', copy: parseLandingMarkdown(amazonRaw) },
  ebay: { slug: 'ebay-ip-check', platform: 'eBay', icon: '/assets/icons/platform/IP_ic_eBay.svg', copy: parseLandingMarkdown(ebayRaw) },
  binance: { slug: 'binance-ip-check', platform: 'Binance', icon: '/assets/icons/platform/IP_ic_binance.svg', copy: parseLandingMarkdown(binanceRaw) },
}
