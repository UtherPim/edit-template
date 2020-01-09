/**
 * canvas 绘制标尺
 *
 * params:{*}
 *      axisWidth:Number,unit:px
 *      lineColor:String,
 *      gridWidth:Number,
 *      gridHeight:Number,
 *
 * dom:Dom元素,canvas的元素
 */

// import { UnitConversion } from '@/utils'
function CanvasRuler(params, dom) {
  let AXIS_WIDTH = 1
  let LINE_COLOR = '#000000'
  let GRID_WIDTH = 100
  let GRID_HEIGHT = 20

  const canvas = dom

  const DRAW_TYPE = {
    HORIZONTAL: 1,
    VERTICAL: 2,
    ALL: 3,
    NONE: 4
  }

  this.getDrawType = function() {
    return DRAW_TYPE
  }

  this.setAxisWidth = function(axisWidth) {
    AXIS_WIDTH = Number(axisWidth) ? Number(axisWidth) : 1
  }
  this.getAxisWidth = function() {
    return AXIS_WIDTH
  }

  this.setLineColor = function(lineColor) {
    LINE_COLOR = lineColor
  }
  this.getLineColor = function() {
    return LINE_COLOR
  }

  this.setGridWidth = function(gridWidth) {
    GRID_WIDTH = Number(gridWidth) ? Number(gridWidth) : 1
  }
  this.getGridWidth = function() {
    return GRID_WIDTH
  }

  this.setGridHeight = function(gridHeight) {
    GRID_HEIGHT = Number(gridHeight) ? Number(gridHeight) : 1
  }
  this.getGridHeight = function() {
    return GRID_HEIGHT
  }

  this.getDomElement = function() { // 清空canvas
    return canvas
  }

  this.clearCanvas = function() {
    canvas.width = canvas.width
  }

  this.setAxisWidth(params.axisWidth)
  this.setLineColor(params.lineColor)
  this.setGridWidth(params.gridWidth)
  this.setGridHeight(params.gridHeight)
}

CanvasRuler.prototype = {
  constructor: CanvasRuler,
  init: function(type) {
    this.clearCanvas()
    const ctx = this.getDomElement().getContext('2d')
    ctx.lineWidth = this.getAxisWidth()
    ctx.strokeStyle = this.getLineColor()
    const DRAW_TYPE = this.getDrawType()
    switch (type) {
      case DRAW_TYPE.HORIZONTAL:
        this.drawHorizontalAxis(ctx)
        break
      case DRAW_TYPE.VERTICAL:
        this.drawVerticalAxis(ctx)
        break
      case DRAW_TYPE.ALL:
        this.drawHorizontalAxis(ctx)
        this.drawVerticalAxis(ctx)
        this.drawNumber(ctx)
        break
      default:
        break
    }
    this.resize(type)
  },

  // 绘制水平轴
  drawHorizontalAxis: function(ctx) {
    const gridWidth = this.getGridWidth()
    const gridHeight = this.getGridHeight()
    ctx.beginPath()
    ctx.moveTo(gridHeight + 0.5, gridHeight)
    ctx.lineTo(gridWidth + 0.5, gridHeight)
    for (let i = 0.5; i < gridWidth; i = i + gridWidth / 10) {
      ctx.moveTo(i, gridHeight)
      if (i < gridHeight) continue
      if (i === gridWidth / 10 * 5) {
        ctx.lineTo(i, gridHeight / 2)
      } else {
        ctx.lineTo(i, gridHeight * 2 / 3)
      }
    }
    ctx.stroke()
    for (let i = gridWidth + 0.5; i < this.getDomElement().width; i = i + gridWidth) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, gridHeight)
      ctx.lineTo(i + gridWidth, gridHeight)
      for (let j = i + gridWidth / 10; j < i + gridWidth; j = j + gridWidth / 10) {
        ctx.moveTo(j, gridHeight)
        if (j === i + gridWidth / 10 * 5) {
          ctx.lineTo(j, gridHeight / 2)
        } else {
          ctx.lineTo(j, gridHeight * 2 / 3)
        }
      }
      ctx.stroke()
    }
  },

  // 绘制垂直轴
  drawVerticalAxis: function(ctx) {
    const gridWidth = this.getGridWidth()
    const gridHeight = this.getGridHeight()
    ctx.beginPath()
    ctx.moveTo(gridHeight, gridHeight + 0.5)
    ctx.lineTo(gridHeight, gridWidth + 0.5)
    for (let i = 0.5; i < gridWidth; i = i + gridWidth / 10) {
      ctx.moveTo(gridHeight, i)
      if (i < gridHeight) continue
      if (i === gridWidth / 10 * 5) {
        ctx.lineTo(gridHeight / 2, i)
      } else {
        ctx.lineTo(gridHeight * 2 / 3, i)
      }
    }
    ctx.stroke()
    for (let i = gridWidth + 0.5; i < this.getDomElement().height; i = i + gridWidth) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(gridHeight, i)
      ctx.lineTo(gridHeight, i + gridWidth)
      for (let j = i + gridWidth / 10; j < i + gridWidth; j = j + gridWidth / 10) {
        ctx.moveTo(gridHeight, j)
        if (j === i + gridWidth / 10 * 5) {
          ctx.lineTo(gridHeight / 2, j)
        } else {
          ctx.lineTo(gridHeight * 2 / 3, j)
        }
      }
      ctx.stroke()
    }
  },

  // 绘制刻度
  drawNumber: function(ctx) {
    // 设置字体
    ctx.font = '12px bold 黑体'
    // 设置颜色
    ctx.fillStyle = '#000'
    // 设置水平对齐方式
    ctx.textAlign = 'center'
    // 设置垂直对齐方式
    ctx.textBaseline = 'middle'
    // 绘制文字（参数：要写的字，x坐标，y坐标）
    for (let i = 0; i < 1960 / 100; i++) {
      if (i === 0) {
        ctx.fillText(0, i * 100 + 10, 10)
        ctx.fillText(0, 10, i * 100 + 10)
      } else if (i === 1) {
        ctx.fillText(80, i * 100 + 10, 10)
        ctx.fillText(80, 10, i * 100 + 10)
      } else {
        ctx.fillText(i * 100 - 20, i * 100 + 10, 10)
        ctx.fillText(i * 100 - 20, 10, i * 100 + 10)
      }
    }
  },
  // 自适应窗口
  resize: function(type) {
    window.onresize = () => {
      this.init(type)
    }
  }

}

export default CanvasRuler
