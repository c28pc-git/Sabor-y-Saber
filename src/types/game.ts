export interface KitchenItem {
  id: string
  emoji: string
  name: string
  question?: string
  options?: string[]
  correctIndex?: number
}

export interface Recipe {
  id: string
  name: string
  emoji: string
  description: string
  itemIds: string[]
  steps: string[]
}

export type ScreenId = 'select' | 'intro' | 'kitchen' | 'recap'
