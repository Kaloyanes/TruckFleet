import { cva, type VariantProps } from 'class-variance-authority'

export { default as Button } from './Button.vue'

export const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  transition-all duration-300 hover:scale-105 active:scale-100 active:translate-y-0.5 shadow-[0_0_25px_rgba(0,0,0,0.10)] active:shadow-[0_0_15px_rgba(0,0,0,0.10)]',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/50',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-destructive/50',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-accent/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-secondary/50',
        ghost: 'hover:bg-accent hover:text-accent-foreground shadow-accent/10',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
