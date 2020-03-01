<template>
  <div id="app">
    <div class="graph-wrapper">
      <svg ref="svg" id="graph-svg" width="800px" height="800px" :style="{ transform: 'scale('+ scale +')'}">
        <g class="axis-group">
          <line x1="0" y1="400" x2="800" y2="400" stroke="grey" style="stroke-opacity: .3;"></line>
          <line x1="400" y1="0" x2="400" y2="800" stroke="grey" style="stroke-opacity: .3;"></line>
        </g>
        <g class="towers-group">
          <circle 
            v-for="(t, i) in linkTowers" 
            :key="i"
            :r="t.r"
            :cx="t.x"
            :cy="t.y"
            fill="#5c48e82e"
            @click="showTooltip( 'tower', i, $event)"
          ></circle>
        </g>
        <g class="points-group">
          <circle 
            v-for="(p, i) in cellPoints" 
            :key="i"
            :r="1"
            :cx="p.x"
            :cy="p.y"
            fill="red"
            @click="showTooltip( 'point', i, $event)"
          ></circle>
        </g>
        <g class="links-group">
          <line 
            v-for="(p, i) in linkLines"
            :key="i" 
            :x1="p.x"
            :y1="p.y" 
            :x2="p.tx" 
            :y2="p.ty" 
            stroke="green" 
            style="stroke-opacity: .7;"
            stroke-dasharray="1 1"
          ></line>
        </g>
      </svg>
      <div class="tooltip-editor" v-if="tooltip.show" :style="tooltip.position">
        <span class="close-tooltip" @click="hideTooltip()">x</span>
        <strong>{{tooltip.type}}</strong><br />
        <span class="single-input-boxes-wrapper">
          X: <input type="number" min="-400" max="400" v-model="tooltip.data[0]"><br />
          Y: <input type="number" min="-400" max="400" v-model="tooltip.data[1]"><br />
          Reach :<input type="number" min="0" max="100" v-if="tooltip.type == 'tower'" v-model="tooltip.data[2]">
        </span>
        <div class="delete-button" @click="deleteThis()">Delete</div>
      </div>
    </div>
    <div class="controls">

      <div class="zoom-contol">
       <strong>Zoom</strong><span><input type="range" min="1" max="3" step="0.1" value="1" v-model="scale"></span>
      </div>
     
      <div class="inputs-wrapper"> 
        <strong>Towers</strong>
        <span class="single-input-boxes-wrapper">
          X:<input type="number" min="-400" max="400" v-model="newTower[0]">
          Y:<input type="number" min="-400" max="400" v-model="newTower[1]">
          R:<input type="number" min="0" max="100" v-model="newTower[2]">
        </span>
        <span class="add-item" @click="addTower()">Add</span>
      </div>
      
      <div class="inputs-wrapper">
        <strong>Points</strong>
        <span class="single-input-boxes-wrapper">
          X:<input type="number" min="-400" max="400" v-model="newPoint[0]">
          Y:<input type="number" min="-400" max="400" v-model="newPoint[1]">
        </span>
        <span class="add-item" @click="addPoint()">Add</span>
      </div>
    </div>
  </div>
</template>

<script>

import getTheBestTowerForAPoint from './services/bestTowerCalculator';

export default {
  name: 'App',
  data() {
    return {
     towers: [[0, 0, 10],  [20, 20, 5],  [-10, 0, 12], [-95,90, 45], [-95,-90, 45]],
     points: [[0,0], [-100, 100], [15,10],[18, 18],[110, 100]],
     scale: 1,
     center: 800 / 2,
     tooltip: {
      type: 'tower',
      index: 0,
      data: [],
      show: false,
      position: {
        top: 0,
        left: 0,
      }
     },
     newTower: [0,0,0],
     newPoint:[0,0]
    }
  },
  methods: {
    positionAccordingToXAxis(coordinate) {
      return Number(coordinate) + this.center
    },
    positionAccordingToYAxis(coordinate) {
      return coordinate >= 0 ? this.center - coordinate : Math.abs(coordinate) + this.center
    },
    showTooltip(type, index, event) {
      const data = type == 'point' ? this.points[index] : this.towers[index]
      this.tooltip = {
        type,
        index,
        data,
        show: true,
        position: {
          top: event.pageY + 'px',
          left: event.pageX + 'px'
        }
      }
    },
    deleteThis() {
      this.tooltip.type == 'point' ? this.deleteAPoint(this.tooltip.index) : this.deleteATower(this.tooltip.index)
      this.tooltip.show = false
    },
    deleteAPoint(index) {
      this.points.splice(index, 1)
    },
    deleteATower(index) {
      this.towers.splice(index, 1)
    },
    hideTooltip() {
      this.tooltip.show = false
    },
    addPoint() {
      this.points.push(this.newPoint)
      this.newPoint = [0,0]
    },
    addTower() {
      this.towers.push(this.newTower)
      this.newTower = [0,0]
    }
  },
  computed: {
    linkTowers() {
      return this.towers.map(m => {
        return {
          x: this.positionAccordingToXAxis(m[0]),
          y: this.positionAccordingToYAxis(m[1]),
          r: m[2],
        }
      })
    },
    cellPoints() {
      return this.points.map(m => {
        let point = {
          x: this.positionAccordingToXAxis(m[0]),
          y: this.positionAccordingToYAxis(m[1]),
        }

        const tower = getTheBestTowerForAPoint(m, this.towers)
        if( tower.length) {
          let tx = this.positionAccordingToXAxis(tower[0])
          let ty = this.positionAccordingToYAxis(tower[1])
          point = {...point , tx, ty} 
        }
        return point
      })
    },
    linkLines() {
      return this.cellPoints.filter(f => f.tx)
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  position: relative;
  cursor: pointer;
}
.graph-wrapper {
  overflow: hidden;
  position: relative;
}
svg#graph-svg {
    background-color: lavender;
}

.inputs-wrapper {
    margin-bottom: 10px;
}

.tooltip-editor strong {
    text-transform: capitalize;
}

span.single-input-boxes-wrapper {
    margin-top: 5px;
    width: 100%;
    display: block;
}

span.single-input-boxes-wrapper input {
    width: 40px;
}

.tooltip-editor {
  position: absolute;
  width: 150px;
  height: auto;
  background-color: #2c3e50;
  padding: 10px;
  z-index: 99;
  color: #e3e3e3;
  text-align: left;
}
.close-tooltip {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  color: #eee;
  background-color: black;
  border-radius: 100%;
  text-align: center;
}

.delete-button {
  padding: 5px 0;
  text-align: center;
  color: red;
  margin-top: 5px;
}

.controls {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
}

.zoom-contol > * {
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
}

.inputs-wrapper {
    text-align: center;
}

span.add-item {
    padding: 5px 10px;
    background-color: #96f2d3;
    font-size: 13px;
}

.inputs-wrapper > * {
    display: inline-block !important;
    width: auto !important;
    margin-left: 10px;
}

</style>
