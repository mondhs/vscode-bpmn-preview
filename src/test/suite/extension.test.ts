import * as assert from 'assert';
import { extractBpmnDetails } from '../../bpmn_mapping';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { bpmnRepo_getServiceTaskBpmnDiagram } from './process_repo';

// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual([1, 2, 3].indexOf(5), -1);
		assert.strictEqual([1, 2, 3].indexOf(0), -1);
	});
    test('BPMN Parsing', () => {
        const bpmn_diagram = bpmnRepo_getServiceTaskBpmnDiagram();
        const result = extractBpmnDetails(bpmn_diagram);
        assert.equal(false,result.bpmnActivityInfos==null,"bpmnActivityInfos is null");
        assert.equal(2,result.bpmnActivityInfos.length,"Service Task and User task exists");

    });
});
