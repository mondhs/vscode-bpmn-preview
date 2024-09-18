export function bpmnRepo_getServiceTaskBpmnDiagram() {
    return `
    <?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" xmlns:design="http://flowable.org/design" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.flowable.org/processdef" design:palette="flowable-process-palette">
      <process id="extension-event-based-process" name="Extension event-based process" isExecutable="true">
        <documentation>Process for extension testing</documentation>
        <extensionElements>
          <design:stencilid><![CDATA[BPMNDiagram]]></design:stencilid>
          <design:creationdate><![CDATA[2024-09-10T10:59:41.552Z]]></design:creationdate>
          <design:modificationdate><![CDATA[2024-09-18T06:48:01.023Z]]></design:modificationdate>
        </extensionElements>
        <startEvent id="extension-start-event" name="Extension process start event" isInterrupting="true">
          <extensionElements>
            <flowable:eventType><![CDATA[Perf_startProcess]]></flowable:eventType>
            <flowable:eventOutParameter source="_key" target="_key"></flowable:eventOutParameter>
            <flowable:eventOutParameter source="_variation" target="_variation"></flowable:eventOutParameter>
            <flowable:eventOutParameter source="_modelName" target="_modelName"></flowable:eventOutParameter>
            <flowable:eventOutParameter source="_modelVersion" target="_modelVersion"></flowable:eventOutParameter>
            <flowable:eventOutParameter source="_uri" target="_uri"></flowable:eventOutParameter>
            <flowable:channelKey><![CDATA[my_inbound_kafka_event]]></flowable:channelKey>
            <design:stencilid><![CDATA[StartEventRegistryEvent]]></design:stencilid>
          </extensionElements>
        </startEvent>
        <serviceTask id="extension-echo-event" name="Echo event" flowable:async="true" flowable:type="send-event" flowable:triggerable="true">
          <extensionElements>
            <flowable:eventType><![CDATA[my_command]]></flowable:eventType>
            <flowable:triggerEventType><![CDATA[my_response]]></flowable:triggerEventType>
            <flowable:eventInParameter source="echo" target="commandName"></flowable:eventInParameter>
            <flowable:channelKey><![CDATA[my_outbound_kafka_command]]></flowable:channelKey>
            <flowable:triggerEventCorrelationParameter name="requestId" value="\${requestId}"></flowable:triggerEventCorrelationParameter>
            <design:stencilid><![CDATA[SendAndReceiveEventTask]]></design:stencilid>
            <design:stencilsuperid><![CDATA[Task]]></design:stencilsuperid>
          </extensionElements>
        </serviceTask>
        <endEvent id="endEvent">
          <extensionElements>
            <design:stencilid><![CDATA[EndNoneEvent]]></design:stencilid>
          </extensionElements>
        </endEvent>
        <sequenceFlow id="sid-04C26525-91E4-460E-A78D-4476DCE3ED0A" sourceRef="extension-start-event" targetRef="extension-echo-event">
          <extensionElements>
            <design:stencilid><![CDATA[SequenceFlow]]></design:stencilid>
          </extensionElements>
        </sequenceFlow>
        <sequenceFlow id="sid-4F4E9C2F-91A1-4754-B45B-389472301D5C" sourceRef="extension-echo-event" targetRef="formTask1">
          <extensionElements>
            <design:stencilid><![CDATA[SequenceFlow]]></design:stencilid>
          </extensionElements>
        </sequenceFlow>
        <sequenceFlow id="sid-124DCDD3-3032-4FD7-8B57-8674BAEA7246" sourceRef="echoEventFail" targetRef="formTask1">
          <extensionElements>
            <design:stencilid><![CDATA[SequenceFlow]]></design:stencilid>
          </extensionElements>
        </sequenceFlow>
        <userTask id="formTask1" name="UserTaskOnResponse" flowable:formFieldValidation="false">
          <extensionElements>
            <flowable:taskListener event="create" expression="\${task.setVariableLocal('_uri', 'http://my/id')}"></flowable:taskListener>
            <flowable:task-candidates-type><![CDATA[all]]></flowable:task-candidates-type>
            <design:stencilid><![CDATA[FormTask]]></design:stencilid>
            <design:stencilsuperid><![CDATA[Task]]></design:stencilsuperid>
          </extensionElements>
        </userTask>
        <sequenceFlow id="sequenceFlow4" sourceRef="formTask1" targetRef="endEvent">
          <extensionElements>
            <design:stencilid><![CDATA[SequenceFlow]]></design:stencilid>
          </extensionElements>
        </sequenceFlow>
        <boundaryEvent id="echoEventFail" attachedToRef="extension-echo-event">
          <extensionElements>
            <design:stencilid><![CDATA[IntermediateErrorEventBoundary]]></design:stencilid>
          </extensionElements>
          <errorEventDefinition></errorEventDefinition>
        </boundaryEvent>
      </process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_extension-event-based-process">
        <bpmndi:BPMNPlane bpmnElement="extension-event-based-process" id="BPMNPlane_extension-event-based-process">
          <bpmndi:BPMNShape bpmnElement="extension-start-event" id="BPMNShape_extension-start-event">
            <omgdc:Bounds height="30.0" width="30.0" x="390.0" y="205.0"></omgdc:Bounds>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape bpmnElement="extension-echo-event" id="BPMNShape_extension-echo-event">
            <omgdc:Bounds height="80.0" width="100.0" x="510.0" y="180.0"></omgdc:Bounds>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape bpmnElement="endEvent" id="BPMNShape_endEvent">
            <omgdc:Bounds height="28.0" width="28.0" x="915.0" y="206.0"></omgdc:Bounds>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape bpmnElement="formTask1" id="BPMNShape_formTask1">
            <omgdc:Bounds height="80.0" width="100.0" x="765.0" y="180.0"></omgdc:Bounds>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNShape bpmnElement="echoEventFail" id="BPMNShape_echoEventFail">
            <omgdc:Bounds height="30.0" width="30.0" x="518.170255219795" y="245.0"></omgdc:Bounds>
          </bpmndi:BPMNShape>
          <bpmndi:BPMNEdge bpmnElement="sequenceFlow4" id="BPMNEdge_sequenceFlow4" flowable:sourceDockerX="50.0" flowable:sourceDockerY="40.0" flowable:targetDockerX="14.0" flowable:targetDockerY="14.0">
            <omgdi:waypoint x="864.9499999999312" y="220.0"></omgdi:waypoint>
            <omgdi:waypoint x="915.0" y="220.0"></omgdi:waypoint>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge bpmnElement="sid-124DCDD3-3032-4FD7-8B57-8674BAEA7246" id="BPMNEdge_sid-124DCDD3-3032-4FD7-8B57-8674BAEA7246" flowable:sourceDockerX="15.0" flowable:sourceDockerY="15.0" flowable:targetDockerX="25.0" flowable:targetDockerY="79.0">
            <omgdi:waypoint x="533.170255219795" y="274.94999741134495"></omgdi:waypoint>
            <omgdi:waypoint x="533.170255219795" y="344.0"></omgdi:waypoint>
            <omgdi:waypoint x="790.0" y="344.0"></omgdi:waypoint>
            <omgdi:waypoint x="790.0" y="259.95000000000005"></omgdi:waypoint>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge bpmnElement="sid-04C26525-91E4-460E-A78D-4476DCE3ED0A" id="BPMNEdge_sid-04C26525-91E4-460E-A78D-4476DCE3ED0A" flowable:sourceDockerX="14.0" flowable:sourceDockerY="15.0" flowable:targetDockerX="50.0" flowable:targetDockerY="40.0">
            <omgdi:waypoint x="417.94999938984034" y="220.0"></omgdi:waypoint>
            <omgdi:waypoint x="510.0" y="220.0"></omgdi:waypoint>
          </bpmndi:BPMNEdge>
          <bpmndi:BPMNEdge bpmnElement="sid-4F4E9C2F-91A1-4754-B45B-389472301D5C" id="BPMNEdge_sid-4F4E9C2F-91A1-4754-B45B-389472301D5C" flowable:sourceDockerX="50.0" flowable:sourceDockerY="40.0" flowable:targetDockerX="3.0" flowable:targetDockerY="39.0">
            <omgdi:waypoint x="609.9499999998944" y="220.0"></omgdi:waypoint>
            <omgdi:waypoint x="687.0" y="220.0"></omgdi:waypoint>
            <omgdi:waypoint x="687.0" y="219.0"></omgdi:waypoint>
            <omgdi:waypoint x="764.9999999999361" y="219.0"></omgdi:waypoint>
          </bpmndi:BPMNEdge>
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </definitions>    
    `;
}