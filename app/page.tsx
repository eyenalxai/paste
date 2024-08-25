"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const TestSchema = z.object({
	oof: z.string()
})

export default function Page() {
	const methods = useForm<z.infer<typeof TestSchema>>({
		resolver: zodResolver(TestSchema),
		defaultValues: {
			oof: ""
		}
	})

	return "sss"
}
