<script>
import { Bar } from 'vue-chartjs'
import ChartDataLabels from 'chartjs-plugin-datalabels'
import { formatMoney } from 'CommonHelpers'

export default {
  extends: Bar,
  props:   {
    data: {
      type:    Object,
      default: () => ({}),
    },
    options: {
      type:    Object,
      default: () => ({}),
    },
  },
  computed: {
    chart_data(){
      let tmp_chart_data = this.data
      for(let dataset of tmp_chart_data.datasets){
        if(dataset.color) {
          dataset.borderColor = dataset.color
          dataset.backgroundColor = dataset.color
        }
        else {
          dataset.borderColor = '#f87979'
          dataset.backgroundColor = '#f87979'
        }

        if(!dataset.fill) dataset.fill = false
        if(!dataset.lineTension) dataset.lineTension = 0
        if(!dataset.pointRadius) dataset.pointRadius = 4
        if(!dataset.pointHoverRadius) dataset.pointHoverRadius = 4
      }

      return tmp_chart_data
    },
    chart_options() {
      let options = this.options
      let datasets_number = this.chart_data.datasets.length
      let tmp_options = {
        responsive:          true,
        maintainAspectRatio: false,
        tooltips:            {
          enabled: false,
        },
        layout: {
          padding: {
            top: 25,
          },
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [],
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback:    function(value) {
                let tmp = ''
                if(value == 0 && Math.abs(value) >= 100)
                  tmp = formatMoney(value,0)
                else
                  tmp = formatMoney(value,2)
                return tmp
              },
            },
          }],
        },

        animation: {
          onProgress: () => {
            this.$emit('chart-progressing')
          },
          onComplete: () => {
            this.$emit('chart-updated')
          },
        },

        plugins: {
          datalabels: {
            anchor: 'end',
            align:  'top',
            font:   {
              size:  10,
              style: 'bold',
            },
            formatter: function(value, context) {
              const isChartBarStacked = options != null && options.custom_stacked
              const isFirstDataset = context.datasetIndex == 0
              let tmp_value = formatMoney(value, 0)

              if (isChartBarStacked) {
                // Find last visible dataset index
                const chart = context.chart
                let lastVisibleIndex = -1
                for (let i = datasets_number - 1; i >= 0; i--) {
                  const meta = chart.getDatasetMeta(i)
                  const isHidden = meta.hidden === null
                    ? chart.data.datasets[i].hidden
                    : meta.hidden
                  if (!isHidden) {
                    lastVisibleIndex = i
                    break
                  }
                }
                if (context.datasetIndex === lastVisibleIndex) {
                  tmp_value = options.custom_data[context.dataIndex]
                } else {
                  tmp_value = ''
                }
              }
              else if (!isFirstDataset) {
                tmp_value = ''
              }

              return tmp_value
            },
          },
        },
      }
      if(options != null){
        tmp_options = Object.assign(tmp_options, options)

        if(options.custom_stacked){
          tmp_options.scales.xAxes.push({stacked: true})
          tmp_options.scales.yAxes[0].stacked = true
        }
      }
      return tmp_options
    },
  },
  watch: {
    chart_data() {
      this.renderChart(this.chart_data, this.chart_options)
    },
    chart_options() {
      this.renderChart(this.chart_data, this.chart_options)
    },
  },
  mounted () {
    this.addPlugin(ChartDataLabels)
    this.renderChart(this.chart_data, this.chart_options)
  },
}
</script>
