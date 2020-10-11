use std::io;

use actix_web::{App, HttpServer, HttpRequest, HttpResponse, Error, middleware::Logger, web};
use actix::prelude::*;
use actix_web_actors::ws;
use actix_files::Files;

use serde_json as json;

struct WSHandler {}

impl Actor for WSHandler {
    type Context = ws::WebsocketContext<Self>;
    
    fn started(&mut self, ctx: &mut Self::Context) {
        ctx.text("{\"message\":\"Hello from Rust!\"}");
    }
}

impl StreamHandler<Result<ws::Message, ws::ProtocolError>> for WSHandler {
    fn handle(
        &mut self,
        message: Result<ws::Message, ws::ProtocolError>,
        ctx: &mut Self::Context
    ) {
        match message {
            Ok(ws::Message::Ping(message)) => {
                ctx.pong(&message);
            },
            Ok(ws::Message::Text(message)) => {
                let text = handle_message(message).unwrap();
                ctx.text(text);
            },
            _ => ctx.stop(),
        }
    }
}

fn handle_message(message: String) -> Result<String, json::Error> {
    let data: json::Value = json::from_str(message.as_str())?;
    let incoming_message = data["message"].as_str().unwrap();

    if incoming_message == "ping" {
        return Ok("{\"message\":\"pong\"}".to_string());
    }

    json::to_string(&json::json!({
        "message": format!("{} {}", "Received", incoming_message)
    }))
}

async fn handle_ws(req: HttpRequest, stream: web::Payload) -> Result<HttpResponse, Error> {
    ws::start(WSHandler {}, &req, stream)
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    std::env::set_var("RUST_LOG", "actix_server=info,actix_web=info");
    env_logger::init();

    HttpServer::new(|| {
        App::new()
            // abilita logger
            .wrap(Logger::default())
            // aggiungi la route per la websocket
            .service(web::resource("/ws").route(web::get().to(handle_ws)))
            // aggiungi i file in static
            .service(Files::new("/", "static/").index_file("index.html"))
    })
    // apri il server su localhost porta 8080
    .bind("127.0.0.1:8080")?
    .run()
    .await
}
