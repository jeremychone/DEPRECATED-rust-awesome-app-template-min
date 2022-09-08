#![cfg_attr(
	all(not(debug_assertions), target_os = "windows"),
	windows_subsystem = "windows"
)]

use std::sync::atomic::{AtomicU32, Ordering};
use std::sync::Arc;

use serde::Serialize;
use tauri::{command, AppHandle, Manager, State, Wry};
use ts_rs::TS;

type Counter = Arc<AtomicU32>;

fn main() {
	let counter: Counter = Arc::new(AtomicU32::new(0));

	tauri::Builder::default()
		.manage(counter)
		.invoke_handler(tauri::generate_handler![add_count])
		.run(tauri::generate_context!())
		.expect("error while running tauri application");
}

#[derive(TS, Serialize, Clone)]
#[ts(export, export_to = "../src-ui/src/bindings/")]
struct HubEvent<D: Serialize + Clone> {
	hub: String,
	topic: String,

	#[serde(skip_serializing_if = "Option::is_none")]
	label: Option<String>,

	#[serde(skip_serializing_if = "Option::is_none")]
	data: Option<D>,
}

#[command]
fn add_count(num: u32, counter: State<'_, Counter>, app_handle: AppHandle<Wry>) -> u32 {
	let prev = counter.fetch_add(num, Ordering::SeqCst);
	let val = prev + num;

	let hub_event = HubEvent {
		hub: "Data".to_string(),
		topic: "Counter".to_string(),
		label: Some("update".to_string()),
		data: Some(val),
	};

	match app_handle.emit_all("HubEvent", hub_event) {
		Ok(_) => println!("counter updated {val}"),
		Err(err) => {
			println!("ERROR - Fail to emit event 'counter_udpated'. Cause: {:?} ", err)
		}
	}

	val
}
