// export interface OntoHierarchy {
//     name: string;
//     children?: OntoHierarchy[];
// }

import { RawNodeDatum } from "react-d3-tree";

interface Ontology {
    id: string;
    isObsolete?: boolean;
    name: string;
    definition?: {text: string};
    comment?: string; 
    synonyms?: [{
        name: string,
        type: string
    }];
    children?: [{
        id: string,
        relation: string
    }];
    history?: [{
        timestamp: string,
        action: string,
        category: string,
        text: string}];
    xRefs?: [{
        dbCode: string,
        dbId: string
    }];
    aspect?: string;
    useage?: string;
}

interface QuickGoOntologyResponse {
    numberOfHits: number,
    results: Ontology[],
    pageInfo: any
}

export async function generateHierarchy(code: string, relations: string[] = ["is_a"]): Promise<RawNodeDatum> {

    const response = await fetch(`https://www.ebi.ac.uk/QuickGO/services/ontology/go/terms/${code}/complete`);

    const data: QuickGoOntologyResponse = await response.json();
    const ontology = data.results[0]

    let ontoHirerarchy: RawNodeDatum = {
        name: ontology.name 
    }

    if('children' in ontology) {
        let children = ontology.children;
        //@ts-ignore
        children = children.filter(child => relations.includes(child.relation));
        // @ts-ignore
        console.log(children)
        // @ts-ignore
        ontoHirerarchy.children = await Promise.all(children.map(async (child: {id: string, relation: string})=>{
            const childOntoHirerarchy: RawNodeDatum = await generateHierarchy(child.id);
            return childOntoHirerarchy;
        })
        )
    }

    return ontoHirerarchy
}