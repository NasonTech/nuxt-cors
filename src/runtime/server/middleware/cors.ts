import defu from 'defu'
import { defineEventHandler, getRequestURL, handleCors, useRuntimeConfig } from '#imports'

export default defineEventHandler((event) => {
	const requestUrl = getRequestURL(event)
	const pathName = requestUrl.pathname

	const runtimeConfig = useRuntimeConfig()
	const config = runtimeConfig.cors
	if (!config.rules) return

	// Check if there is a rule
	const rule = config.rules.find((rule) => {
		if (typeof rule.path === 'string') return rule.path === pathName
		if (rule.path instanceof RegExp) return rule.path.test(pathName)
		return rule.path.some((path) => path.test(pathName))
	})
	if (!rule) return

	const options = defu(rule, rule.options, runtimeConfig.cors.options)

	// Handle CORS
	handleCors(event, options)
})
