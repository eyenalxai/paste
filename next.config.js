/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (isServer) {
			config.externals = config.externals || []
			config.externals.push("tree-sitter")
		}
		return config
	},

	async rewrites() {
		return {
			beforeFiles: [
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
