import { Task } from '@serenity-js/core';
import { Enter, Click } from '@serenity-js/protractor';
import { protractor } from 'protractor';
import { TodoMVCApp } from './ui/TodoMVCApp';

export const ClickOnTable = () =>
    Task.where(`#actor clicks on the table button`,
        Click.on(TodoMVCApp.table),
    );