import * as vscode from 'vscode';

import { BpmnVizProvider } from './bpmnVizEditor';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(BpmnVizProvider.register(context));
}
