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
				},
				{
					source: "/(.*)",
					destination: "https://:1",
					has: [
						{
							type: "host",
							value: "http://(.*)"
						}
					]
				}
			]
		}
	}
}

module.exports = nextConfig
