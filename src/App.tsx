import './App.css'

import { useState } from 'react'
import { Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { Slider } from './components/ui/slider'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible'
import { Label } from '@radix-ui/react-label'
import { ChevronsUpDown } from 'lucide-react'
import { generateHierarchy } from './lib/walk'
import Tree, { RawNodeDatum } from 'react-d3-tree'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'


const handleClick = async (
  code: string,
  setHierarchy: React.Dispatch<React.SetStateAction<RawNodeDatum>>
) => {
  // console.log(code);
  toast("Getting info", {duration: 1500});
  let hierarchy: RawNodeDatum = await generateHierarchy(code);
  console.log(hierarchy);
  setHierarchy(hierarchy);
  toast("Data successfully loaded", {duration: 5000});
}


function App() {
  const [ code, setCode ] = useState<string>("");
  const [ hierarchy, setHierarchy ] = useState<RawNodeDatum>({"name": "Enter go code to generate"});
  const [ nodeSize, setNodeSize ] = useState<{x: number, y: number}>({x: 750, y:200});

  return (
    <>
    <div className='h-screen w-screen relative'>
      <div className='flex w-screen align-middle justify-end p-4 absolute top-0'>
        <div className='flex flex-col gap-4'>
          <div className='flex gap-4'>
            <Input type='text' placeholder='Type go code - GO:0043687' value={code} onChange={(e)=>{setCode(e.target.value)}}></Input>
            <Button className='bg-green-700' onClick={()=>{handleClick(code, setHierarchy)}}>Get tree</Button>
          </div>
          <Collapsible className='flex flex-col'>
            <CollapsibleTrigger className='flex justify-end'>
              <Button variant={"ghost"} size={"sm"}>
                <ChevronsUpDown className='h-4 w-4'/>
                <span>Controls</span>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className='flex flex-col gap-4 p-4'>
              <div className='flex align-baseline gap-2'>
                <Label>x:</Label> 
                <Slider defaultValue={[nodeSize.x]} max={1000} onValueChange={(value)=>setNodeSize({x: value[0], y: nodeSize.y})}/>
              </div>
              <div className='flex align-baseline gap-2'>
                <Label>y:</Label> 
                <Slider defaultValue={[nodeSize.y]} max={500} onValueChange={(value)=>setNodeSize({x: nodeSize.x, y: value[0]})}/>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
      <div className='absolute right-0 bottom-0'>
        <Toaster/>
      </div>
      <div className='h-full w-full'>
        <Tree
          data = {hierarchy}
          orientation='horizontal'
          translate={{x: 250, y: 220}}
          zoom={0.25}
          nodeSize={nodeSize}
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
