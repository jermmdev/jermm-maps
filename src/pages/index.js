import React from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"

import Map from 'pigeon-maps'
import Marker from 'pigeon-marker'

import MarkerDb from '../markerDb.json'
import ReactJson from 'react-json-view'



class IndexPage extends React.Component{
  constructor(props){
    super(props)
    this.state={
      centerCoords: false
      , clickData: {lat: '', lon: '', jobs: []}
      , cleared: []
    }
    this.setCleared = this.setCleared.bind(this)
  }
  setCleared(jobId){
    let clearedArray = this.state.cleared
    if(!clearedArray.includes(jobId)) clearedArray.push(jobId)
    localStorage.setItem('jermmClearedArray', JSON.stringify(clearedArray))
    this.setState({cleared: clearedArray})
  }
  componentDidMount(){
    let clearedArray = JSON.parse(localStorage.getItem('jermmClearedArray'))
    if(!clearedArray || !clearedArray.length) clearedArray = []
    this.setState({cleared: clearedArray})
  }
  render(){
    let markers = []
    for(let lat in MarkerDb){
      for(let lon in MarkerDb[lat]){
        let coords = [parseFloat(lat),parseFloat(lon)]
        let jobArray = MarkerDb[lat][lon].jobs
        if(!this.state.centerCoords) this.setState({centerCoords: [parseFloat(lat), parseFloat(lon)]})
        markers.push(
          <Marker key={coords.toString()} anchor={coords} payload={1} onClick={({ event, anchor, payload }) => {
            this.setState({clickData: {
              lat: parseFloat(lat)
              , lon: parseFloat(lon)
              , jobs: jobArray
            }})
          }} />
        )
      }
    }
    if(!this.state.centerCoords) return (<h4>loading...</h4>)
    let jobChildren = []
    for(let ind in this.state.clickData.jobs){
      let jobId = this.state.clickData.jobs[ind].jobId
      let jobUrl = this.state.clickData.jobs[ind].jobUrl
      let jobData = this.state.clickData.jobs[ind].jobData
      if(this.state.cleared.includes(jobId)) continue
      jobChildren.push(
        <div style={{margin: '2em'}}>
          <div style={{margin: '1em'}}>
            <h4>{jobData.title} - {jobData.company}</h4>
          </div>
          <div style={{margin: '1em'}}>
            <a href={jobUrl} style={{marginRight: '2em'}} target="blank">Indeed Post</a>
            <a style={{marginRight: '2em'}} onClick={()=>{alert('Normally this would go to my job data manager.')}} href="https://www.jermmdev.com/data-manager" target="blank">My Job Data</a>
            <button onClick={()=>{this.setCleared(jobId)}}>Remove</button>
          </div>
          <div  style={{margin: '1em'}}>
            <ReactJson
              collapsed={true}
              src={jobData}
              displayDataTypes={false}
              enableClipboard={false}
              name={jobId}
            />
          </div>
        </div>
      )
    }
    let locationListing = []
    if(this.state.clickData.jobs[0]){
      locationListing.push(
        <div>
          <h3>{this.state.clickData.jobs[0].jobData.location} - {this.state.clickData.lat} , {this.state.clickData.lon}</h3> 
        </div>)
    }
    return(
      <Layout>
        <SEO title="Home" keywords={[`gatsby`, `application`, `react`]} />
        <Map center={this.state.centerCoords} zoom={7} width={800} height={600}>
          {markers}
        </Map>
        <div>
          <span style={{marginRight:'2em'}}>
           Total: {jobChildren.length}
          </span>
          <span>
            <button onClick={()=>{
              localStorage.setItem('jermmClearedArray', JSON.stringify([]))
              this.setState({cleared: []})
            }}>Reset Cleared</button>
          </span>
        </div>
        {locationListing}
        <div>
          {jobChildren}
        </div>
      </Layout>
    )
  }
}

export default IndexPage
