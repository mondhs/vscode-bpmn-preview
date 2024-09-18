
import { XMLParser } from "fast-xml-parser";

interface BpmnDetail{
    bpmnActivityInfos: BpmnActivityInfo[];
}

interface BpmnActivityInfo{
    id: string;
    name: string;
    activityType: string,
    extensionElements: ExtensionElements[];
}

interface ExtensionElements{
    key: string;
    value: string;
}


export function extractBpmnDetails(bpmnText:string):BpmnDetail{
    const options = {
        removeNSPrefix: true,
        ignoreAttributes: false,
        attributeNamePrefix : ""
      };
      
    const parser = new XMLParser(options);

    const root  = parser.parse(bpmnText);
    const processDefinition = root.definitions.process;
    let callActivityInfos = mapCallActivityInfos(processDefinition);
    let serviceTaskInfos = mapServiceTaskInfos(processDefinition);
    let userTaskInfos = mapUserTaskInfos(processDefinition);

    const bpmnDetail =  <BpmnDetail>{
        bpmnActivityInfos : [...callActivityInfos, ...serviceTaskInfos, ...userTaskInfos]
    };
    return bpmnDetail;
}

function mapUserTaskInfos(processDefinition:any):BpmnActivityInfo[]{
    if(!processDefinition.serviceTask){
        return <BpmnActivityInfo[]>[];
    }
    const skipKeys=["stencilid", "stencilsuperid", "task-candidates-type"];
    const anyDetail = processDefinition.userTask;
    const infos = [anyDetail].map((ad:any) =>
    {
        return <BpmnActivityInfo>{
            id: ad.id,
            name: ad.name,
            activityType: "serviceTask",
            extensionElements: Object.keys(ad.extensionElements)
                .filter((seKey:any)=>!skipKeys.includes(seKey))
                .map((seKey:any)=>
                {return <ExtensionElements>{
                    key: seKey,
                    value: JSON.stringify(ad.extensionElements[seKey])
                };}
            )
        };
    });
    
    return infos;
}

function mapServiceTaskInfos(processDefinition:any):BpmnActivityInfo[]{
    if(!processDefinition.serviceTask){
        return <BpmnActivityInfo[]>[];
    }
    const skipKeys=["stencilid", "stencilsuperid", "task-candidates-type"];
    const anyServiceTaskDetail = processDefinition.serviceTask;
    const serviceTaskInfos = [anyServiceTaskDetail].map((ca:any) =>
    {
        return <BpmnActivityInfo>{
            id: ca.id,
            name: ca.name,
            activityType: "serviceTask",
            extensionElements: Object.keys(ca.extensionElements).map((seKey:any)=>
                {return <ExtensionElements>{
                    key: seKey,
                    value: JSON.stringify(ca.extensionElements[seKey])
                };}
            )
        };
    });
    
    return serviceTaskInfos;
}

function mapCallActivityInfos(processDefinition:any):BpmnActivityInfo[]{
    if(!processDefinition.callActivity){
        return <BpmnActivityInfo[]>[];
    }
    const callActivityInfos = [...processDefinition.callActivity].map((ca:any) =>
    {
        return <BpmnActivityInfo>{
            id: ca.id,
            name: ca.name,
            activityType: "callActivity",
            extensionElements: ca.extensionElements?.in?.map((se:any)=>
                {return <ExtensionElements>{
                    key: se?.sourceExpression,
                    value: se?.target
                };}
            )
        };
    });
    
    return callActivityInfos;
}