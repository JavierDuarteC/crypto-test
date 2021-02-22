import { Target,Text } from '@serenity-js/protractor';
import { by } from 'protractor';

export class TodoMVCApp {
    static table = Target.the('crypto list button').located(by.id('#tab-button'));
    static recordedItems = Text.ofAll(Target.all(`recorded items`).located(by.css('.mat-row')));
}