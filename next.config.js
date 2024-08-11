/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { isServer }) => {
		if (isServer) {
			config.externals = config.externals || []
			config.externals.push("tree-sitter")
			config.externals.push("tree-sitter-go")
			config.externals.push("tree-sitter-python")
			config.externals.push("tree-sitter-typescript")
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
