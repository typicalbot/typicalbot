#[macro_use]
extern crate actix_web;

#[macro_use]
extern crate diesel;

use std::{env, io};

use actix_web::{middleware, App, HttpServer};
use diesel::r2d2::ConnectionManager;
use diesel::PgConnection;
use r2d2::{Pool, PooledConnection};

mod response;
mod announcement;
mod schema;

pub type DBPool = Pool<ConnectionManager<PgConnection>>;
pub type DBPooledConnection = PooledConnection<ConnectionManager<PgConnection>>;

#[actix_rt::main]
async fn main() -> io::Result<()> {
    env::set_var("RUST_LOG", "actix_web=debug,actix_server=info");
    env_logger::init();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL");
    let database_manager = ConnectionManager::<PgConnection>::new(database_url);
    let database_pool = r2d2::Pool::builder()
        .build(database_manager)
        .expect("Unable to create database pool");

    HttpServer::new(move || {
        App::new()
            .data(database_pool.clone())
            .wrap(middleware::Logger::default())
            .service(announcement::create)
            .service(announcement::delete)
            .service(announcement::get)
    })
        .bind("0.0.0.0:9000")
        .run()
        .await
}
