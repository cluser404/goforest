import './App.css'

import { useState } from 'react'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { generateHierarchy } from './lib/walk'
import Tree, { RawNodeDatum } from 'react-d3-tree'


const handleClick = async (
  code: string,
  setHierarchy: React.Dispatch<React.SetStateAction<RawNodeDatum>>
) => {
  // console.log(code);
  let hierarchy: RawNodeDatum = await generateHierarchy(code);
  console.log(hierarchy);
  setHierarchy(hierarchy);
}


function App() {
  const [ code, setCode ] = useState<string>("");
  const [ hierarchy, setHierarchy ] = useState<RawNodeDatum>({"name": "generate"});

  return (
    <>
    <div className='h-screen w-screen relative'>
      <div className='flex w-screen align-middle justify-end p-4 absolute top-0'>
        <div className='flex gap-4'>
          <Input type='text' placeholder='GO:123456' value={code} onChange={(e)=>{setCode(e.target.value)}}></Input>
          <Button onClick={()=>{handleClick(code, setHierarchy)}}>Get tree</Button>
        </div>
      </div>
      <div className='h-full w-full'>
        <Tree
          data = {hierarchy}
          orientation='horizontal'
          translate={{x: 250, y: 220}}
          zoom={0.25}
          nodeSize={{x:750, y: 200}}
          separation={{ siblings: 0.5, nonSiblings: 1.5 }}
          renderCustomNodeElement={(rd3tProps)=>{
            const { nodeDatum } = rd3tProps;
            return (
              <g>
                <circle r={10} fill="green" stroke='none'/> 
                <text 
                  className='font-bold, text-4xl'
                  dy = "-0.5em"
                  textAnchor='middle'
                  fill='black'
                  stroke='none'
                >
                  {nodeDatum.name}
                </text>
              </g>
            );
          }}
        />
      </div>
    </div>
    </>
  )
}

export default App
