import {AttributeDictionary} from 'common/attributeDictionary';

test("Able to add a rule and get it back", () => {

    expect.assertions(2);

    const context: string = "fontStyle";
    const propertyName: string = "_fontDescriptionFilePath";
    const rule: Object = {
        displayName: "Font Description Source",
        editor: "filepath"
    };

    const addRuleResult = AttributeDictionary.addRule(context, propertyName, rule);

    expect(addRuleResult).toBe(true);

    const getRuleResult = AttributeDictionary.getRule(context, propertyName);

    expect(getRuleResult).toBe(rule);

});

test ("Not able to retrieve a non-existant rule", () => {
    expect.assertions(1);

    const getRuleResult = AttributeDictionary.getRule("randomContext", "randomPropertyName");

    expect(getRuleResult).toBeNull();

});