/** @type {import('next').NextConfig} */
const nextConfig = {
	async rewrites() {
		return {
			beforeFiles: [
				{
					source: "/:id*/raw",
					destination: "/api/paste/:id*/raw"
				},
				{
					source: "/",
					destination: "/api/cli",
					has: [
						{
							type: "header",
							key: "content-type",
							value: "multipart/form-data.*"
						}
					]
				}
			]
		}
	}
}

module.exports = nextConfig
