<div id="pools">
    <table>
        <tr>
            {{#each pools}}
                <td>
                    <table>
                        <th>{{label}}</th>
                        {{#each pool}}
                            <tr><td>{{this}}</td></tr>
                        {{/each}}
                    </table
                </td>
            {{/each}}
        </tr>
    </table>
</div>
<div id="games">
    <table>
        <tr>
            {{#each ppGames}}
                <td align="center">
                    <table>
                        {{#each this}}
                            <tr>
                                <td align="center" id="{{key}}">
                                    <span class="ppGame t1 button{{#if t1Selected}} selected{{/if}}">{{t1}}</span>
                                    <span>vs.</span>
                                    <span class="ppGame t2 button{{#if t2Selected}} selected{{/if}}">{{t2}}</span>
                                </td>
                            </tr>
                        {{/each}}
                    </table>
                </td>
            {{/each}}
        </tr>
    </table>
</div>
<div id="preq" class="checks">
    <h2>PreQuarters: Pick 8</h2>
    <table>
        <tr>
            {{#each prequarters}}
                <td>
                    <table>
                        {{#each this}}
                            <tr><td><input type="checkbox" id="{{key}}"{{#if checked}} checked{{/if}}/><span class="checkTitle">{{name}}</td></tr>
                        {{/each}}
                    </table>
                </td>
            {{/each}}
        </tr>
    </table>
</div>
<div id="quart" class="checks">
    <h2>Quarters: Pick 8</h2>
    <table>
        <tr>
            {{#each quarters}}
                <td>
                    <table>
                        {{#each this}}
                            <tr><td><input type="checkbox" id="{{key}}{{#if checked}} checked{{/if}}"/><span class="checkTitle">{{name}}</td></tr>
                        {{/each}}
                    </table>
                </td>
            {{/each}}
        </tr>
    </table>
</div>
<div id="semis" class="checks">
    <h2>Semis: Pick 4</h2>
    <table>
        <tr>
            {{#each semis}}
                <td>
                    <table>
                        {{#each this}}
                            <tr><td><input type="checkbox" id="{{key}}{{#if checked}} checked{{/if}}"/><span class="checkTitle">{{name}}</td></tr>
                        {{/each}}
                    </table>
                </td>
            {{/each}}
        </tr>
    </table>
</div>
<div id="finals" class="checks">
    <h2>Finals: Pick 2</h2>
    <table>
        <tr>
            {{#each finals}}
                <td>
                    <table>
                        {{#each this}}
                            <tr><td><input type="checkbox" id="{{key}}{{#if checked}} checked{{/if}}"/><span class="checkTitle">{{name}}</td></tr>
                        {{/each}}
                    </table>
                </td>
            {{/each}}
        </tr>
    </table>
</div>
<div id="winner" class="checks">
    <h2>Pick Your Winner</h2>
    <select>
      {{#each list}}
          <option value="{{this}}">{{this}}</option>
      {{/each}}
    </select>
</div>
