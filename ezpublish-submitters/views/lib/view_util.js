

var moment = require("views/lib/moment-min");
var _ = require("views/lib/underscore-min")._;

var email_strip_regex =[ 
        /^[^<]+</,
        />$/
    ];

var ez_keys = ["EZPublish-1.0", "EZPublish"];

function strip_email_from_submitter(submitter) {
    var email = submitter.slice(0);
    for (var idx in email_strip_regex) {
        email = email.replace(email_strip_regex[idx], "");
    }
    return email;
}

exports.isEasyPublishDoc = function(doc, versions) {
        
        function contains(keyword) {
            return _.contains(doc.keys, keyword);
        }

        if (doc !== undefined && 
            doc.doc_type === "resource_data" &&
            doc.publishing_node !== undefined &&
            doc.identity !== undefined && doc.identity.submitter !== undefined &&
            doc.keys !== undefined && _.some(ez_keys, contains)) {
        
            var email = strip_email_from_submitter(doc.identity.submitter);
            return [ doc.publishing_node, email ];

        }
            
        
        return false;
};



exports.getTimestampForDoc = function(doc) {
    var isots = doc.node_timestamp;
    return moment(isots).sod().unix();
};

exports.searchObjectForPattern = function(obj, regex) {
        var rs = {};
        var tmp = {};
        if (Object.prototype.toString.apply(obj) === "[object String]") {
            tmp = parser(obj.trim(), verb);
        } else if (Object.prototype.toString.apply(obj) === "[object Array]") {
            for (var j=0; j<obj.length; j++) {
                merge(searchObjectForPattern(obj[j], regex), tmp); 
            }
        } else if (Object.prototype.toString.apply(obj) === "[object Object]") {
            for (var key in obj) {
                merge(searchObjectForPattern(obj[key], regex), tmp);
            }
        } 
        if (tmp != undefined && tmp != null) {
            for (var key in tmp) {
                if (rs[key]) {
                    rs[key] += tmp[key];
                } else {
                    rs[key] = tmp[key];
                }
            }
        }

        return rs;
    };

exports.secondsToISODate = function(ts) {
        var ctime = new Date(ts*1000);
        return ctime.toISOString().replace(/\.000Z$/, "Z");
    };

exports.convertDateToSeconds = function(doc){
        return Math.floor(Date.parse(doc.node_timestamp)/1000);
    };
