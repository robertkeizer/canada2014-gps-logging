var express	= require( "express" );
var config	= require( "config" );
var nano	= require( "nano" )( config.couchdb_url );
var db		= nano.use( config.db );

var app = express( );

app.param( 'id', function( req, res, cb, id ){
	req.id = id;
	cb( );
} );

app.param( "attachment_name", function( req, res, cb, attachment_name ){
	req.attachment_name = attachment_name;
	cb ();
} );

app.use( function( req, res, cb ){
	//console.log( req.path );
	cb( );
} );

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

app.get( "/get//:id", function( req, res ){
	db.get( req.id, function( err, dbRes ){
		if( err ){
			return res.json( err );
		}
		return res.json( dbRes );
	} );
} );

app.get( "/get///:id/:attachment_name", function( req, res ){
	db.attachment.get( req.id, req.attachment_name ).pipe( res );
} );

app.get( "/posts", function( req, res ){
	db.view( "posts", "by-time", function( err, body ){
		if( err ){
			return res.json( err );
		}
		return res.json( body );
	} );
} );

app.listen( config.port, function( ){
	console.log( "I'm listening" );
} );
