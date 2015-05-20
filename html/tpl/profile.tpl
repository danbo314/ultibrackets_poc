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
