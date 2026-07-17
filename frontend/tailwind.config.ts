import type { Config } from 'tailwindcss';

/**
 * Tailwind 主题配置
 * 设计 token：暖象牙白底 + 深墨文字 + 陶土橙强调色，营造编辑级纸本质感
 */
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        ivory: '#FAF7F2', // 暖象牙白底色
        ink: {
          DEFAULT: '#1A1A1A', // 深墨主文字
          soft: '#6B6660', // 次级文字
          muted: '#B8B0A6', // 已完成/弱化文字
        },
        terracotta: {
          DEFAULT: '#C2410C', // 陶土橙强调色
          soft: '#FED7AA', // 浅陶土
        },
        sand: '#E8E4DC', // 柔灰边框/分隔
        paper: '#FFFFFF', // 卡片背景
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'], // 衬线显示字体
        sans: ['var(--font-manrope)', 'sans-serif'], // 几何无衬线正文
      },
    },
  },
  plugins: [],
};

export default config;
