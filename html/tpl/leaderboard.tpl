<div id="board">
    <table>
        <th></th>
        <th>Name</th>
        <th>Points</th>
        <th>Winning Team</th>
        {{#each users}}
            <tr>
                <td>{{place @index}}.</td>
                <td>{{name}}</td>
                <td align="center">{{points}}</td>
                <td align="center">{{winner}}</td>
            </tr>
        {{/each}}
    </table>
</div>