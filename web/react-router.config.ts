import type { Config } from '@react-router/dev/config';

export default {
	appDirectory: './src/app',
	ssr: false,
	hydrateFallback: './HydrateFallback.jsx',
} satisfies Config;
