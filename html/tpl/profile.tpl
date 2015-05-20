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
            {{#each pools}}
                <td>
                    <table>
                        {{#each pool}}
                            <tr><td><input type="checkbox"/><span class="checkTitle">{{this}}</td></tr>
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
            {{#each pools}}
                <td>
                    <table>
                        {{#each pool}}
                            <tr><td><input type="checkbox" value="{{key}}"/><span class="checkTitle">{{this}}</td></tr>
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
            {{#each pools}}
                <td>
                    <table>
                        {{#each pool}}
                            <tr><td><input type="checkbox" value="{{key}}"/><span class="checkTitle">{{this}}</td></tr>
                        {{/each}}
                    </table>
                </td>
            {{/each}}
        </tr>
    </table>
</div>
<div id="winner">
    <select>
      {{#each pools}}
          {{#each pool}}
              <option value="{{key}}">{{this}}</option>
          {{/each}}
      {{/each}}
    </select>
</div>
