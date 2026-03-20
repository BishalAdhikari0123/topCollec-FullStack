declare module 'next/navigation' {
  // Minimal declarations to satisfy TypeScript in this project.
  // Runtime implementations are provided by Next.js.
  export function redirect(url: string): never
  export function notFound(): never
  // useRouter is only used in client components here, so keep it loosely typed.
  export function useRouter(): any
}

declare module 'next/navigation.js' {
  export * from 'next/navigation'
}
