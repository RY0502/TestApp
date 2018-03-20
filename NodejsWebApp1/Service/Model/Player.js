//Model structure for service layer entities. Must be in sync with database Model entities for consistency

exports.playerServObj = function Player(data) {
    this.name = data.name;
    this.dob = data.dob;
    this.team = data.team;
    this.imagelink = data.imagelink;
    this.preferredposition = data.preferredposition;
}
