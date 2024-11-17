import type { H3CorsOptions } from 'h3'

import { defineNuxtModule, createResolver, addServerHandler } from '@nuxt/kit'
import defu from 'defu'

export type CORSRouteRule = {
	path: string | RegExp | RegExp[]
	options: H3CorsOptions
}

// Module options TypeScript interface definition
export type CORSModuleOptions = {
	rules?: CORSRouteRule[]
	options?: H3CorsOptions
}

export default defineNuxtModule<CORSModuleOptions>({
	meta: {
		name: 'nuxt-cors',
		configKey: 'cors',
	},
	setup(options, nuxt) {
		nuxt.options.runtimeConfig.cors = defu(nuxt.options.runtimeConfig.cors, options)

		const resolver = createResolver(import.meta.url)

		addServerHandler({ handler: resolver.resolve('./runtime/server/middleware/cors') })

		nuxt.options.build.transpile.push(resolver.resolve('runtime'))
	},
})

declare module 'nuxt/schema' {
	interface RuntimeConfig {
		cors: CORSModuleOptions
	}
}
