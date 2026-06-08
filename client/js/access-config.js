// 访问密码配置
// 注意：密码验证现在通过 Cloudflare Workers API 进行
// 请在 Cloudflare Dashboard 的 Worker 设置中设置环境变量：
// - VITE_ACCESS_PASSWORD: 访问密码
// - VITE_ENABLE_ACCESS_PROTECTION: 是否启用保护 (true/false)

// 是否启用访问密码保护（仅用于本地开发预览）
// 生产环境中，此配置由 Cloudflare Workers 环境变量控制
export const ENABLE_ACCESS_PROTECTION = (import.meta.env.VITE_ENABLE_ACCESS_PROTECTION !== 'false');

// 此函数现在已弃用，验证通过 API 进行
// 保留仅用于向后兼容
export function verifyAccessPassword(inputPassword) {
	console.warn('verifyAccessPassword is deprecated, use /api/verify-password API instead');
	return false;
}

// 本地开发预览时的密码（仅用于本地测试）
export const ACCESS_PASSWORD = import.meta.env.VITE_ACCESS_PASSWORD || 'changeme';

