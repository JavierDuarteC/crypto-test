import 'jasmine';
import { Ensure, contain } from '@serenity-js/assertions';
import { actorCalled } from '@serenity-js/core';
import { BrowseTheWeb, Wait, isVisible } from '@serenity-js/protractor';
import { CallAnApi } from '@serenity-js/rest';
import { protractor } from 'protractor';
import { ClickOnTable, OpenTheApp } from './screenplay';
import { TodoMVCApp } from './screenplay/ui/TodoMVCApp';

describe(`TodoMVC app`, () => {

    it(`helps us learn Serenity/JS`, () =>
        actorCalled('Jasmine')
            .whoCan(
                BrowseTheWeb.using(protractor.browser),
                CallAnApi.at('http://localhost:4200'),
            )
            .attemptsTo(
                OpenTheApp(),
                ClickOnTable(),
                Wait.until(TodoMVCApp.table, isVisible()),
                Ensure.that(TodoMVCApp.recordedItems, contain('BitTube') ),
            ));
});