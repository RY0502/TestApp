//Model structure for service layer entities. Must be in sync with database Model entities for consistency

exports.fixtureServObj = function Fixture (data) {
    this.matchday = data.matchday;
    this.status = data.status;
    this.matchdate = data.matchdate;
    this.teamhome = data.teamhome;
    this.teamaway = data.teamaway;
    this.result = data.result;
}
