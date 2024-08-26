/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return {
			beforeFiles: [
				{
					source: "/:id*/raw",
					destination: "/api/paste/:id*/raw"
				}
			]
		}
	}
}

module.exports = nextConfig
