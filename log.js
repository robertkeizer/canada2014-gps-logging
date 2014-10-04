var express	= require( "express" );
var config	= require( "config" );
var nano	= require( "nano" )( config.couchdb_url );
var db		= nano.use( config.db );

var app = express( );
app.get( '/insert', function( req, res ){
	
	db.insert( req.query, function( err, dbRes ){
		if( err ){
			return res.json( err );
		}

		return res.json( false );
	} );
} );

app.get( "/get", function( req, res ){
	db.view( "by-time", "lat-long", function( err, body ){
		if( err ){
			return res.json( err );
		}

		return res.json( body.rows );
	} );
} );

app.listen( config.port, function( ){
	console.log( "I'm listening" );
} );
