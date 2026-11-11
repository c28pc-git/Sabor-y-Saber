import * as THREE from 'three'

function canvas2d(size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('2d context unavailable')
  return { canvas, ctx }
}

export function createWoodTexture(base = '#a9703f', grain = '#7d5330') {
  const { canvas, ctx } = canvas2d(256)
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 46; i++) {
    const y = (i / 46) * 256 + (Math.random() * 6 - 3)
    ctx.strokeStyle = grain
    ctx.globalAlpha = 0.12 + Math.random() * 0.18
    ctx.lineWidth = 1 + Math.random() * 2
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.bezierCurveTo(
      85,
      y + (Math.random() * 14 - 7),
      170,
      y + (Math.random() * 14 - 7),
      256,
      y,
    )
    ctx.stroke()
  }
  ctx.globalAlpha = 1
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function createTileFloorTexture() {
  const { canvas, ctx } = canvas2d(256)
  ctx.fillStyle = '#d7d0c2'
  ctx.fillRect(0, 0, 256, 256)
  ctx.strokeStyle = '#b7ad9c'
  ctx.lineWidth = 4
  const step = 64
  for (let x = 0; x <= 256; x += step) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, 256)
    ctx.stroke()
  }
  for (let y = 0; y <= 256; y += step) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(256, y)
    ctx.stroke()
  }
  for (let i = 0; i < 500; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.04})`
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 2, 2)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(6, 6)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function createWallTexture(base = '#d7dee3') {
  const { canvas, ctx } = canvas2d(256)
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 1400; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.025})`
    ctx.fillRect(Math.random() * 256, Math.random() * 256, 1, 1)
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(2.5, 1.2)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function createBrushedMetalTexture() {
  const { canvas, ctx } = canvas2d(128)
  ctx.fillStyle = '#4b4e52'
  ctx.fillRect(0, 0, 128, 128)
  for (let y = 0; y < 128; y += 2) {
    ctx.strokeStyle = `rgba(255,255,255,${0.03 + Math.random() * 0.06})`
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(128, y)
    ctx.stroke()
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function createMarbleTexture(base = '#ece4d3', vein = '#c7ac7c') {
  const { canvas, ctx } = canvas2d(512)
  const grad = ctx.createLinearGradient(0, 0, 512, 512)
  grad.addColorStop(0, base)
  grad.addColorStop(1, '#dfd5bd')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 512, 512)

  for (let i = 0; i < 9; i++) {
    const startX = Math.random() * 512
    const startY = Math.random() * 512
    ctx.strokeStyle = `rgba(${i % 2 === 0 ? '160,130,90' : '90,80,60'},${0.18 + Math.random() * 0.2})`
    ctx.lineWidth = 0.6 + Math.random() * 2.2
    ctx.beginPath()
    ctx.moveTo(startX, startY)
    let x = startX
    let y = startY
    for (let seg = 0; seg < 6; seg++) {
      const nx = x + (Math.random() * 160 - 80)
      const ny = y + (Math.random() * 160 - 80)
      ctx.quadraticCurveTo(x + (Math.random() * 60 - 30), y + (Math.random() * 60 - 30), nx, ny)
      x = nx
      y = ny
    }
    ctx.stroke()
  }
  for (let i = 0; i < 260; i++) {
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`
    ctx.fillRect(Math.random() * 512, Math.random() * 512, 1, 1)
  }
  void vein
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function createSubwayTileTexture(tileColor = '#f6f3ec', groutColor = '#d7d1c3') {
  const { canvas, ctx } = canvas2d(512)
  ctx.fillStyle = groutColor
  ctx.fillRect(0, 0, 512, 512)

  const tileW = 128
  const tileH = 56
  const gap = 4
  let row = 0
  for (let y = 0; y < 512; y += tileH + gap) {
    const offset = row % 2 === 0 ? 0 : -tileW / 2
    for (let x = offset; x < 512; x += tileW + gap) {
      const shade = 0.94 + Math.random() * 0.06
      ctx.fillStyle = tileColor
      ctx.globalAlpha = shade
      ctx.fillRect(x, y, tileW - gap, tileH - gap)
      ctx.globalAlpha = 1
      // glossy top-edge highlight
      const g = ctx.createLinearGradient(0, y, 0, y + tileH - gap)
      g.addColorStop(0, 'rgba(255,255,255,0.35)')
      g.addColorStop(0.3, 'rgba(255,255,255,0)')
      g.addColorStop(1, 'rgba(0,0,0,0.05)')
      ctx.fillStyle = g
      ctx.fillRect(x, y, tileW - gap, tileH - gap)
    }
    row++
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function createPlankFloorTexture(base = '#b98a54', grain = '#8f6239') {
  const { canvas, ctx } = canvas2d(512)
  ctx.fillStyle = base
  ctx.fillRect(0, 0, 512, 512)

  const plankH = 64
  for (let y = 0; y < 512; y += plankH) {
    const shade = Math.random() * 18 - 9
    ctx.fillStyle = `rgba(0,0,0,${shade > 0 ? shade / 180 : 0})`
    ctx.fillRect(0, y, 512, plankH)
    if (shade < 0) {
      ctx.fillStyle = `rgba(255,255,255,${-shade / 220})`
      ctx.fillRect(0, y, 512, plankH)
    }
    // plank seam
    ctx.strokeStyle = 'rgba(0,0,0,0.25)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(512, y)
    ctx.stroke()
    // wood grain streaks along the plank
    for (let i = 0; i < 5; i++) {
      const gy = y + Math.random() * plankH
      ctx.strokeStyle = grain
      ctx.globalAlpha = 0.08 + Math.random() * 0.14
      ctx.lineWidth = 0.8 + Math.random() * 1.6
      ctx.beginPath()
      ctx.moveTo(0, gy)
      ctx.bezierCurveTo(170, gy + (Math.random() * 10 - 5), 340, gy + (Math.random() * 10 - 5), 512, gy)
      ctx.stroke()
    }
    ctx.globalAlpha = 1
    // staggered end-joints between planks
    const joints = 3 + Math.floor(Math.random() * 2)
    for (let j = 0; j < joints; j++) {
      const jx = (512 / joints) * j + Math.random() * 30
      ctx.strokeStyle = 'rgba(0,0,0,0.18)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(jx, y)
      ctx.lineTo(jx, y + plankH)
      ctx.stroke()
    }
  }
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}
