// ECharts 按需注册：只引入用到的图表与组件，控制打包体积
// 页面通过 `import '@renderer/utils/echarts'` 触发注册副作用
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'

use([CanvasRenderer, LineChart, BarChart, PieChart, GridComponent, LegendComponent, TooltipComponent])
