use actix_web::web::{Data, Json, Path};
use actix_web::{web, HttpResponse};
use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
use diesel::result::Error;
use diesel::{ExpressionMethods, Insertable, Queryable, RunQueryDsl};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::response::Response;
use crate::{DBPool, DBPooledConnection};

use super::schema::announcements;
use diesel::query_dsl::methods::{FilterDsl, LimitDsl, OrderDsl};
use std::str::FromStr;

pub type Announcements = Response<Announcement>;

#[derive(Debug, Deserialize, Serialize)]
pub struct Announcement {
    pub id: String,
    pub created_at: DateTime<Utc>,
    pub message: String,
}

impl Announcement {
    pub fn new(message: String) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            created_at: Utc::now(),
            message,
        }
    }

    pub fn to_announcement_record(&self) -> AnnouncementRecord {
        AnnouncementRecord {
            id: Uuid::new_v4(),
            created_at: Utc::now().naive_utc(),
            message: self.message.clone(),
        }
    }
}

#[table_name = "announcements"]
#[derive(Queryable, Insertable)]
pub struct AnnouncementRecord {
    pub id: Uuid,
    pub created_at: NaiveDateTime,
    pub message: String,
}

impl AnnouncementRecord {
    fn to_announce(&self) -> Announcement {
        Announcement {
            id: self.id.to_string(),
            created_at: Utc.from_utc_datetime(&self.created_at),
            message: self.message.clone(),
        }
    }
}

#[derive(Debug, Deserialize, Serialize)]
pub struct AnnouncementRequest {
    pub message: Option<String>
}

impl AnnouncementRequest {
    pub fn to_announcement(&self) -> Option<Announcement> {
        match &self.message {
            Some(message) => Some(Announcement::new(message.to_string())),
            None => None
        }
    }
}

fn create_announcement(announcement: Announcement, conn: &DBPooledConnection) -> Result<Announcement, Error> {
    use crate::schema::announcements::dsl::*;

    let announcement_record = announcement.to_announcement_record();
    let _ = diesel::insert_into(announcements).values(&announcement_record).execute(conn);

    Ok(announcement_record.to_announcement())
}

fn delete_announcement(_id: Uuid, conn: &DBPooledConnection) -> Result<(), Error> {
    use crate::schema::announcements::dsl::*;

    let res = diesel::delete(announcements.filter(id.eq(_id))).execute(conn);

    match res {
        Ok(_) => Ok(()),
        Err(err) => Err(err)
    }
}

fn find_announcement(_id: Uuid, conn: &DBPooledConnection) -> Result<Announcement, Error> {
    use crate::schema::announcements::dsl::*;

    let res = announcements.filter(id.eq(_id)).load::<AnnouncementRecord>(conn);

    match res {
        Ok(announcements_record) => match announcements_record.first() {
            Some(announcement_record) => Ok(announcement_record.to_announcement()),
            _ => Err(Error::NotFound)
        },
        Err(err) => Err(err)
    }
}

#[post("/announcements")]
pub async fn create(announcement_request: Json<AnnouncementRequest>, pool: Data<DBPool>) -> HttpResponse {
    let conn = pool.get().expect("Unable to connect database pool");

    let announcement = web::block(move || create_announcement(announcement_request.to_announcement().unwrap(), &conn)).await;

    match announcement {
        Ok(announcement) => HttpResponse::Created()
            .content_type("application/json")
            .json(announcement),
        _ => HttpResponse::NoContent().await.unwrap()
    }
}

#[delete("/announcements/{id}")]
pub async fn delete(path: Path<(String, )>, pool: Data<DBPool>) -> HttpResponse {
    let conn = pool.get().expect("Unable to connect database pool");

    let _ = web::block(move || delete_announcement(Uuid::from_str(path.0.as_str()).unwrap(), &conn)).await;

    HttpResponse::NoContent()
        .content_type("application/json")
        .await
        .unwrap()
}

pub async fn get(path: Path<(String, )>, pool: Data<DBPool>) -> HttpResponse {
    let conn = pool.get().expect("Unable to connect database pool");

    let announcement = web::block(move || find_announcement(Uuid::from_str(path.0.as_str()).unwrap(), &conn)).await;

    match announcement {
        Ok(announcement) => HttpResponse::Ok()
            .content_type("application/json")
            .json(announcement),
        _ => HttpResponse::NoContent()
            .content_type("application/json")
            .await
            .unwrap()
    }
}
