#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Vanaheim News Manager
--------------------
GUI en PySide6 para administrar el archivo news-data.js y ver una previsualización
en tiempo real de cómo se verían las noticias en la interfaz del patcher.

Características:
- Abrir / guardar news-data.js
- Añadir, duplicar y eliminar noticias
- Editar id, tag, título, excerpt, fecha/hora, publicación y body HTML
- Generar ID automáticamente desde el título
- Previsualización en tiempo real
- Orden automático por createdAt (más nuevo primero)
- Validaciones básicas
"""

from __future__ import annotations

import html
import re
import sys
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import List, Optional, Tuple

from PySide6.QtCore import QDateTime, QSignalBlocker, Qt, QTimer
from PySide6.QtGui import QAction, QColor, QFont, QTextOption
from PySide6.QtWidgets import (
    QApplication,
    QCheckBox,
    QComboBox,
    QDateTimeEdit,
    QFileDialog,
    QFormLayout,
    QFrame,
    QGridLayout,
    QGroupBox,
    QHBoxLayout,
    QInputDialog,
    QLabel,
    QLineEdit,
    QListWidget,
    QListWidgetItem,
    QMainWindow,
    QMessageBox,
    QPushButton,
    QPlainTextEdit,
    QSizePolicy,
    QSplitter,
    QStatusBar,
    QTextBrowser,
    QToolBar,
    QVBoxLayout,
    QWidget,
)


APP_TITLE = "Vanaheim News Manager"
DEFAULT_TIMEZONE = "-06:00"


@dataclass
class NewsItem:
    id: str = ""
    tag: str = "update"
    title: str = ""
    excerpt: str = ""
    created_at: str = ""
    published: bool = True
    body: str = ""

    def sort_key(self) -> Tuple[int, str]:
        dt = parse_iso_datetime_safe(self.created_at)
        if dt is None:
            return (0, self.created_at or "")
        return (1, dt.isoformat())

    def pretty_date(self) -> str:
        return format_news_date(self.created_at)

    def clone(self) -> "NewsItem":
        return NewsItem(
            id=self.id,
            tag=self.tag,
            title=self.title,
            excerpt=self.excerpt,
            created_at=self.created_at,
            published=self.published,
            body=self.body,
        )


def parse_iso_datetime_safe(value: str) -> Optional[datetime]:
    value = (value or "").strip()
    if not value:
        return None

    try:
        return datetime.fromisoformat(value)
    except ValueError:
        return None


def format_news_date(value: str) -> str:
    dt = parse_iso_datetime_safe(value)
    if dt is None:
        return "Fecha inválida"

    months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
              "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
    return f"{dt.day:02d} · {months[dt.month - 1]} · {dt.year}"


def slugify(value: str) -> str:
    value = value.lower().strip()

    replacements = {
        "á": "a", "à": "a", "ä": "a", "â": "a",
        "é": "e", "è": "e", "ë": "e", "ê": "e",
        "í": "i", "ì": "i", "ï": "i", "î": "i",
        "ó": "o", "ò": "o", "ö": "o", "ô": "o",
        "ú": "u", "ù": "u", "ü": "u", "û": "u",
        "ñ": "n",
    }
    for old, new in replacements.items():
        value = value.replace(old, new)

    value = re.sub(r"[^a-z0-9]+", "-", value)
    value = re.sub(r"-{2,}", "-", value).strip("-")
    return value or "nueva-noticia"


def escape_js_single(value: str) -> str:
    return (
        value.replace("\\", "\\\\")
             .replace("'", "\\'")
             .replace("\r", "\\r")
             .replace("\n", "\\n")
    )


def escape_js_template(value: str) -> str:
    return (
        value.replace("\\", "\\\\")
             .replace("`", "\\`")
             .replace("${", "\\${")
    )


def unescape_js_single(value: str) -> str:
    return (
        value.replace("\\'", "'")
             .replace("\\n", "\n")
             .replace("\\r", "\r")
             .replace("\\\\", "\\")
    )


def unescape_js_template(value: str) -> str:
    return (
        value.replace("\\`", "`")
             .replace("\\${", "${")
             .replace("\\\\", "\\")
    )


def extract_balanced_array(source: str, marker: str = "window.NEWS_DATA") -> str:
    marker_pos = source.find(marker)
    if marker_pos == -1:
        raise ValueError("No se encontró window.NEWS_DATA en el archivo.")

    array_start = source.find("[", marker_pos)
    if array_start == -1:
        raise ValueError("No se encontró el inicio del arreglo de noticias.")

    depth = 0
    in_single = False
    in_double = False
    in_template = False
    escape = False

    for i in range(array_start, len(source)):
        ch = source[i]

        if escape:
            escape = False
            continue

        if ch == "\\" and (in_single or in_double or in_template):
            escape = True
            continue

        if in_single:
            if ch == "'":
                in_single = False
            continue

        if in_double:
            if ch == '"':
                in_double = False
            continue

        if in_template:
            if ch == "`":
                in_template = False
            continue

        if ch == "'":
            in_single = True
            continue

        if ch == '"':
            in_double = True
            continue

        if ch == "`":
            in_template = True
            continue

        if ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                return source[array_start:i + 1]

    raise ValueError("No se pudo extraer el arreglo balanceado de noticias.")


def split_top_level_objects(array_text: str) -> List[str]:
    text = array_text.strip()
    if not text.startswith("[") or not text.endswith("]"):
        raise ValueError("El bloque de noticias no es un arreglo válido.")

    inner = text[1:-1]
    objects: List[str] = []

    depth = 0
    in_single = False
    in_double = False
    in_template = False
    escape = False
    obj_start = None

    for i, ch in enumerate(inner):
        if escape:
            escape = False
            continue

        if ch == "\\" and (in_single or in_double or in_template):
            escape = True
            continue

        if in_single:
            if ch == "'":
                in_single = False
            continue

        if in_double:
            if ch == '"':
                in_double = False
            continue

        if in_template:
            if ch == "`":
                in_template = False
            continue

        if ch == "'":
            in_single = True
            continue

        if ch == '"':
            in_double = True
            continue

        if ch == "`":
            in_template = True
            continue

        if ch == "{":
            if depth == 0:
                obj_start = i
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0 and obj_start is not None:
                objects.append(inner[obj_start:i + 1])

    return objects


def extract_field(pattern: str, text: str, *, required: bool = False, default: str = "") -> str:
    match = re.search(pattern, text, flags=re.DOTALL)
    if not match:
        if required:
            raise ValueError(f"No se encontró el campo requerido con patrón: {pattern}")
        return default
    return match.group(1)


def parse_news_data_js(source: str) -> List[NewsItem]:
    array_text = extract_balanced_array(source)
    object_texts = split_top_level_objects(array_text)

    items: List[NewsItem] = []

    for chunk in object_texts:
        item = NewsItem(
            id=unescape_js_single(extract_field(r"\bid\s*:\s*'((?:\\.|[^'\\])*)'", chunk, required=True)),
            tag=unescape_js_single(extract_field(r"\btag\s*:\s*'((?:\\.|[^'\\])*)'", chunk, default="update")),
            title=unescape_js_single(extract_field(r"\btitle\s*:\s*'((?:\\.|[^'\\])*)'", chunk, default="")),
            excerpt=unescape_js_single(extract_field(r"\bexcerpt\s*:\s*'((?:\\.|[^'\\])*)'", chunk, default="")),
            created_at=unescape_js_single(extract_field(r"\bcreatedAt\s*:\s*'((?:\\.|[^'\\])*)'", chunk, default="")),
            published=extract_field(r"\bpublished\s*:\s*(true|false)", chunk, default="true") == "true",
            body=unescape_js_template(extract_field(r"\bbody\s*:\s*`((?:\\.|[^`\\])*)`", chunk, default="")),
        )
        items.append(item)

    return items


def serialize_news_data_js(items: List[NewsItem]) -> str:
    lines = ["window.NEWS_DATA = ["]

    for index, item in enumerate(items):
        comma = "," if index < len(items) - 1 else ""
        lines.extend([
            "  {",
            f"    id: '{escape_js_single(item.id)}',",
            f"    tag: '{escape_js_single(item.tag)}',",
            f"    title: '{escape_js_single(item.title)}',",
            f"    excerpt: '{escape_js_single(item.excerpt)}',",
            f"    createdAt: '{escape_js_single(item.created_at)}',",
            f"    published: {'true' if item.published else 'false'},",
            "    body: `",
            escape_js_template(item.body),
            f"    `",
            f"  }}{comma}",
        ])

    lines.append("];")
    lines.append("")
    return "\n".join(lines)


def build_preview_html(items: List[NewsItem], selected: Optional[NewsItem]) -> str:
    tag_labels = {
        "update": "Actualización",
        "event": "Evento",
        "maint": "Mantenimiento",
    }

    def tag_label(tag: str) -> str:
        return tag_labels.get(tag, "Noticia")

    sorted_items = sorted(
        items,
        key=lambda x: parse_iso_datetime_safe(x.created_at) or datetime.min,
        reverse=True,
    )

    list_cards = []
    for item in sorted_items:
        excerpt = html.escape(item.excerpt or "")
        title = html.escape(item.title or "Sin título")
        date_text = html.escape(item.pretty_date())
        label = html.escape(tag_label(item.tag))
        card_class = html.escape(item.tag or "update")
        muted = "" if item.published else "<span class='unpublished'>Oculta</span>"

        list_cards.append(f"""
        <div class="news-card {'selected' if selected and item.id == selected.id else ''}">
          <div class="news-tag {card_class}">{label}</div>
          {muted}
          <h3>{title}</h3>
          <p>{excerpt}</p>
          <div class="news-date">{date_text}</div>
          <div class="news-read-more">Leer más ›</div>
        </div>
        """)

    modal_html = ""
    if selected is not None:
        modal_html = f"""
        <div class="modal-shell">
          <div class="modal-card">
            <div class="modal-header">
              <div class="news-tag {html.escape(selected.tag)}">{html.escape(tag_label(selected.tag))}</div>
              <div class="modal-title">{html.escape(selected.title or 'Sin título')}</div>
              <div class="modal-date">{html.escape(selected.pretty_date())}</div>
            </div>
            <div class="modal-body">
              {selected.body or '<p>Sin contenido.</p>'}
            </div>
          </div>
        </div>
        """

    return f"""<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<style>
  body {{
    background: #04060e;
    color: #d8cdb8;
    font-family: Georgia, 'Times New Roman', serif;
    margin: 0;
    padding: 18px;
  }}

  .layout {{
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 18px;
    min-height: calc(100vh - 36px);
  }}

  .panel {{
    background: rgba(12,17,34,.74);
    border: 1px solid rgba(200,168,75,.16);
    border-radius: 16px;
    padding: 16px;
    box-shadow: 0 16px 40px rgba(0,0,0,.35);
  }}

  .panel h2 {{
    font-family: Georgia, serif;
    font-size: 17px;
    margin: 0 0 14px;
    color: #e8cc80;
    letter-spacing: .04em;
  }}

  .news-list {{
    display: flex;
    flex-direction: column;
    gap: 10px;
  }}

  .news-card {{
    border: 1px solid rgba(180,150,80,0.18);
    border-radius: 14px;
    background: rgba(14,19,40,.6);
    padding: 12px 14px;
  }}

  .news-card.selected {{
    border-color: rgba(220,185,100,0.38);
    box-shadow: 0 0 0 1px rgba(220,185,100,0.08) inset;
  }}

  .news-tag {{
    display: inline-block;
    font-family: Consolas, monospace;
    font-size: 10px;
    letter-spacing: .12em;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 999px;
    margin-bottom: 6px;
  }}

  .news-tag.update {{
    background: rgba(42,95,168,.2);
    color: #7ab2e8;
    border: 1px solid rgba(42,95,168,.3);
  }}

  .news-tag.event {{
    background: rgba(139,26,42,.2);
    color: #e87a8a;
    border: 1px solid rgba(139,26,42,.3);
  }}

  .news-tag.maint {{
    background: rgba(122,98,40,.2);
    color: #e8cc80;
    border: 1px solid rgba(200,168,75,.3);
  }}

  .news-card h3 {{
    margin: 2px 0 5px;
    font-size: 15px;
    color: #f2ead7;
  }}

  .news-card p {{
    margin: 0;
    font-size: 13px;
    color: #9d927f;
    font-style: italic;
    line-height: 1.5;
  }}

  .news-date {{
    font-family: Consolas, monospace;
    font-size: 11px;
    color: #655d4d;
    margin-top: 7px;
  }}

  .news-read-more {{
    font-family: Consolas, monospace;
    font-size: 10px;
    color: #a78b48;
    margin-top: 6px;
  }}

  .unpublished {{
    float: right;
    font-size: 11px;
    color: #f4ca64;
    opacity: .9;
  }}

  .modal-shell {{
    display: flex;
    align-items: flex-start;
    justify-content: center;
    padding-top: 12px;
  }}

  .modal-card {{
    width: 100%;
    max-width: 720px;
    background: rgba(12,17,34,.82);
    border: 1px solid rgba(200,168,75,.2);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 22px 80px rgba(0,0,0,.48);
  }}

  .modal-header {{
    padding: 20px 22px 14px;
    border-bottom: 1px solid rgba(200,168,75,.1);
  }}

  .modal-title {{
    margin-top: 8px;
    font-size: 24px;
    line-height: 1.2;
    color: #f6f0e1;
    font-weight: bold;
  }}

  .modal-date {{
    font-family: Consolas, monospace;
    font-size: 12px;
    color: #7b7465;
    margin-top: 7px;
  }}

  .modal-body {{
    padding: 18px 22px 24px;
    color: rgba(216,205,184,.88);
    line-height: 1.75;
    font-size: 15px;
  }}

  .modal-body p {{
    margin: 0 0 14px;
  }}

  .modal-body .modal-detail {{
    color: #9d927f !important;
    font-size: 14px !important;
    font-style: normal !important;
  }}

  .hint {{
    color: #8a816f;
    font-size: 12px;
    margin-top: 8px;
  }}
</style>
</head>
<body>
  <div class="layout">
    <div class="panel">
      <h2>Lista de noticias</h2>
      <div class="news-list">
        {''.join(list_cards) if list_cards else '<div class="hint">No hay noticias cargadas.</div>'}
      </div>
    </div>
    <div class="panel">
      <h2>Previsualización</h2>
      {modal_html if modal_html else '<div class="hint">Selecciona o crea una noticia para verla aquí.</div>'}
    </div>
  </div>
</body>
</html>
"""


class MainWindow(QMainWindow):
    def __init__(self) -> None:
        super().__init__()
        self.setWindowTitle(APP_TITLE)
        self.resize(1500, 920)

        self.file_path: Optional[Path] = None
        self.items: List[NewsItem] = []
        self._loading_form = False
        self._dirty = False

        self.preview_timer = QTimer(self)
        self.preview_timer.setSingleShot(True)
        self.preview_timer.setInterval(160)
        self.preview_timer.timeout.connect(self.refresh_preview)

        self._build_ui()
        self._connect_signals()
        self._apply_dark_palette()
        self.new_file()

    # ---------- UI ----------
    def _build_ui(self) -> None:
        self._build_toolbar()
        self._build_statusbar()

        splitter = QSplitter(Qt.Horizontal)
        self.setCentralWidget(splitter)

        left_panel = QWidget()
        left_layout = QVBoxLayout(left_panel)
        left_layout.setContentsMargins(10, 10, 10, 10)
        left_layout.setSpacing(10)

        file_box = QGroupBox("Archivo")
        file_layout = QGridLayout(file_box)

        self.lbl_file = QLabel("Sin archivo abierto")
        self.lbl_file.setWordWrap(True)

        self.btn_open = QPushButton("Abrir news-data.js")
        self.btn_save = QPushButton("Guardar")
        self.btn_save_as = QPushButton("Guardar como...")

        file_layout.addWidget(self.lbl_file, 0, 0, 1, 3)
        file_layout.addWidget(self.btn_open, 1, 0)
        file_layout.addWidget(self.btn_save, 1, 1)
        file_layout.addWidget(self.btn_save_as, 1, 2)

        list_box = QGroupBox("Noticias")
        list_layout = QVBoxLayout(list_box)

        actions_row = QHBoxLayout()
        self.btn_add = QPushButton("Añadir")
        self.btn_duplicate = QPushButton("Duplicar")
        self.btn_delete = QPushButton("Eliminar")
        actions_row.addWidget(self.btn_add)
        actions_row.addWidget(self.btn_duplicate)
        actions_row.addWidget(self.btn_delete)

        self.news_list = QListWidget()
        self.news_list.setAlternatingRowColors(False)

        list_layout.addLayout(actions_row)
        list_layout.addWidget(self.news_list)

        left_layout.addWidget(file_box)
        left_layout.addWidget(list_box, 1)

        right_splitter = QSplitter(Qt.Vertical)

        editor_panel = QWidget()
        editor_layout = QVBoxLayout(editor_panel)
        editor_layout.setContentsMargins(10, 10, 10, 10)
        editor_layout.setSpacing(10)

        meta_box = QGroupBox("Datos de la noticia")
        meta_form = QFormLayout(meta_box)
        meta_form.setLabelAlignment(Qt.AlignRight | Qt.AlignVCenter)

        self.edit_id = QLineEdit()
        self.btn_generate_id = QPushButton("Generar desde título")

        id_row = QWidget()
        id_layout = QHBoxLayout(id_row)
        id_layout.setContentsMargins(0, 0, 0, 0)
        id_layout.setSpacing(8)
        id_layout.addWidget(self.edit_id, 1)
        id_layout.addWidget(self.btn_generate_id)

        self.combo_tag = QComboBox()
        self.combo_tag.addItems(["update", "event", "maint"])

        self.check_published = QCheckBox("Publicada")

        self.edit_title = QLineEdit()

        self.edit_excerpt = QPlainTextEdit()
        self.edit_excerpt.setPlaceholderText("Resumen corto que aparece en la tarjeta.")
        self.edit_excerpt.setFixedHeight(90)
        self.edit_excerpt.setWordWrapMode(QTextOption.WrapAtWordBoundaryOrAnywhere)

        dt_container = QWidget()
        dt_layout = QHBoxLayout(dt_container)
        dt_layout.setContentsMargins(0, 0, 0, 0)
        dt_layout.setSpacing(8)

        self.edit_created = QDateTimeEdit()
        self.edit_created.setCalendarPopup(True)
        self.edit_created.setDisplayFormat("yyyy-MM-dd HH:mm:ss")

        self.edit_timezone = QLineEdit(DEFAULT_TIMEZONE)
        self.edit_timezone.setMaximumWidth(100)
        self.edit_timezone.setPlaceholderText("-06:00")

        self.btn_now = QPushButton("Ahora")

        dt_layout.addWidget(self.edit_created, 1)
        dt_layout.addWidget(self.edit_timezone)
        dt_layout.addWidget(self.btn_now)

        meta_form.addRow("ID:", id_row)
        meta_form.addRow("Tag:", self.combo_tag)
        meta_form.addRow("Estado:", self.check_published)
        meta_form.addRow("Título:", self.edit_title)
        meta_form.addRow("Excerpt:", self.edit_excerpt)
        meta_form.addRow("CreatedAt:", dt_container)

        body_box = QGroupBox("Body HTML")
        body_layout = QVBoxLayout(body_box)

        self.edit_body = QPlainTextEdit()
        self.edit_body.setPlaceholderText(
            "<p>Escribe aquí el HTML que irá dentro del modal.</p>\n"
            "<p class=\"modal-detail\">Puedes usar clases, <strong>, <em>, <br>, etc.</p>"
        )
        self.edit_body.setLineWrapMode(QPlainTextEdit.WidgetWidth)

        body_toolbar = QHBoxLayout()
        self.btn_insert_p = QPushButton("<p>")
        self.btn_insert_detail = QPushButton("modal-detail")
        self.btn_insert_br = QPushButton("<br>")
        self.btn_insert_strong = QPushButton("<strong>")
        self.btn_insert_em = QPushButton("<em>")
        body_toolbar.addWidget(self.btn_insert_p)
        body_toolbar.addWidget(self.btn_insert_detail)
        body_toolbar.addWidget(self.btn_insert_br)
        body_toolbar.addWidget(self.btn_insert_strong)
        body_toolbar.addWidget(self.btn_insert_em)
        body_toolbar.addStretch(1)

        body_layout.addLayout(body_toolbar)
        body_layout.addWidget(self.edit_body, 1)

        editor_layout.addWidget(meta_box)
        editor_layout.addWidget(body_box, 1)

        preview_panel = QWidget()
        preview_layout = QVBoxLayout(preview_panel)
        preview_layout.setContentsMargins(10, 10, 10, 10)
        preview_layout.setSpacing(10)

        preview_header = QHBoxLayout()
        preview_title = QLabel("Previsualización en tiempo real")
        preview_title.setStyleSheet("font-size: 15px; font-weight: 700;")
        self.btn_refresh_preview = QPushButton("Refrescar")
        preview_header.addWidget(preview_title)
        preview_header.addStretch(1)
        preview_header.addWidget(self.btn_refresh_preview)

        self.preview = QTextBrowser()
        self.preview.setOpenExternalLinks(False)

        preview_layout.addLayout(preview_header)
        preview_layout.addWidget(self.preview, 1)

        right_splitter.addWidget(editor_panel)
        right_splitter.addWidget(preview_panel)
        right_splitter.setStretchFactor(0, 3)
        right_splitter.setStretchFactor(1, 2)

        splitter.addWidget(left_panel)
        splitter.addWidget(right_splitter)
        splitter.setStretchFactor(0, 0)
        splitter.setStretchFactor(1, 1)
        splitter.setSizes([350, 1100])

    def _build_toolbar(self) -> None:
        toolbar = QToolBar("Principal", self)
        toolbar.setMovable(False)
        self.addToolBar(toolbar)

        self.act_new = QAction("Nuevo", self)
        self.act_open = QAction("Abrir", self)
        self.act_save = QAction("Guardar", self)
        self.act_save_as = QAction("Guardar como", self)
        self.act_add = QAction("Añadir noticia", self)
        self.act_duplicate = QAction("Duplicar", self)
        self.act_delete = QAction("Eliminar", self)

        toolbar.addAction(self.act_new)
        toolbar.addAction(self.act_open)
        toolbar.addAction(self.act_save)
        toolbar.addAction(self.act_save_as)
        toolbar.addSeparator()
        toolbar.addAction(self.act_add)
        toolbar.addAction(self.act_duplicate)
        toolbar.addAction(self.act_delete)

    def _build_statusbar(self) -> None:
        status = QStatusBar(self)
        self.setStatusBar(status)

    def _apply_dark_palette(self) -> None:
        self.setStyleSheet("""
            QMainWindow, QWidget {
                background: #0b0f1b;
                color: #d8cdb8;
            }

            QGroupBox {
                border: 1px solid rgba(200,168,75,0.18);
                border-radius: 12px;
                margin-top: 14px;
                padding-top: 12px;
                font-weight: 600;
                color: #e8cc80;
            }

            QGroupBox::title {
                subcontrol-origin: margin;
                left: 12px;
                padding: 0 6px;
            }

            QLabel {
                color: #d8cdb8;
            }

            QLineEdit, QPlainTextEdit, QTextBrowser, QListWidget, QComboBox, QDateTimeEdit {
                background: #111828;
                color: #e8decb;
                border: 1px solid rgba(200,168,75,0.18);
                border-radius: 10px;
                padding: 8px;
                selection-background-color: #7a6228;
                selection-color: white;
            }

            QListWidget::item {
                padding: 10px;
                border-radius: 8px;
                margin: 2px 4px;
            }

            QListWidget::item:selected {
                background: rgba(200,168,75,0.16);
                color: #fff0c2;
            }

            QPushButton {
                background: #182033;
                color: #e8decb;
                border: 1px solid rgba(200,168,75,0.2);
                border-radius: 10px;
                padding: 8px 12px;
            }

            QPushButton:hover {
                background: #202a43;
                border-color: rgba(220,185,100,0.38);
            }

            QPushButton:pressed {
                background: #111828;
            }

            QToolBar {
                background: rgba(4,6,14,.94);
                border-bottom: 1px solid rgba(200,168,75,0.18);
                spacing: 6px;
                padding: 6px;
            }

            QStatusBar {
                background: rgba(4,6,14,.94);
                border-top: 1px solid rgba(200,168,75,0.14);
            }

            QCheckBox {
                spacing: 8px;
            }

            QScrollBar:vertical {
                background: #0e1422;
                width: 12px;
                margin: 2px;
                border-radius: 6px;
            }

            QScrollBar::handle:vertical {
                background: #4f4322;
                min-height: 24px;
                border-radius: 6px;
            }
        """)

    # ---------- Signals ----------
    def _connect_signals(self) -> None:
        self.btn_open.clicked.connect(self.open_file)
        self.btn_save.clicked.connect(self.save_file)
        self.btn_save_as.clicked.connect(self.save_file_as)

        self.btn_add.clicked.connect(self.add_news)
        self.btn_duplicate.clicked.connect(self.duplicate_current_news)
        self.btn_delete.clicked.connect(self.delete_current_news)

        self.btn_generate_id.clicked.connect(self.generate_id_from_title)
        self.btn_now.clicked.connect(self.set_now)
        self.btn_refresh_preview.clicked.connect(self.refresh_preview)

        self.btn_insert_p.clicked.connect(lambda: self.insert_body_snippet("<p></p>"))
        self.btn_insert_detail.clicked.connect(
            lambda: self.insert_body_snippet('<p class="modal-detail"></p>')
        )
        self.btn_insert_br.clicked.connect(lambda: self.insert_body_snippet("<br>"))
        self.btn_insert_strong.clicked.connect(lambda: self.insert_body_snippet("<strong></strong>"))
        self.btn_insert_em.clicked.connect(lambda: self.insert_body_snippet("<em></em>"))

        self.news_list.currentRowChanged.connect(self.on_list_selection_changed)

        self.edit_id.textChanged.connect(self.on_form_changed)
        self.combo_tag.currentTextChanged.connect(self.on_form_changed)
        self.check_published.toggled.connect(self.on_form_changed)
        self.edit_title.textChanged.connect(self.on_title_changed)
        self.edit_excerpt.textChanged.connect(self.on_form_changed)
        self.edit_created.dateTimeChanged.connect(self.on_form_changed)
        self.edit_timezone.textChanged.connect(self.on_form_changed)
        self.edit_body.textChanged.connect(self.on_form_changed)

        self.act_new.triggered.connect(self.new_file)
        self.act_open.triggered.connect(self.open_file)
        self.act_save.triggered.connect(self.save_file)
        self.act_save_as.triggered.connect(self.save_file_as)
        self.act_add.triggered.connect(self.add_news)
        self.act_duplicate.triggered.connect(self.duplicate_current_news)
        self.act_delete.triggered.connect(self.delete_current_news)

    # ---------- File ops ----------
    def maybe_save(self) -> bool:
        if not self._dirty:
            return True

        answer = QMessageBox.question(
            self,
            APP_TITLE,
            "Hay cambios sin guardar. ¿Quieres guardarlos antes de continuar?",
            QMessageBox.Yes | QMessageBox.No | QMessageBox.Cancel,
            QMessageBox.Yes,
        )

        if answer == QMessageBox.Cancel:
            return False

        if answer == QMessageBox.Yes:
            return self.save_file()

        return True

    def new_file(self) -> None:
        if not self.maybe_save():
            return

        self.file_path = None
        self.items = []
        self.populate_list()
        self.add_news(select_new=True, mark_dirty=False)
        self._set_dirty(False)
        self._update_file_label()
        self.statusBar().showMessage("Nuevo documento listo.", 2500)

    def open_file(self) -> None:
        if not self.maybe_save():
            return

        file_name, _ = QFileDialog.getOpenFileName(
            self,
            "Abrir news-data.js",
            str(Path.cwd()),
            "JavaScript (*.js);;Todos los archivos (*.*)",
        )
        if not file_name:
            return

        path = Path(file_name)
        try:
            text = path.read_text(encoding="utf-8")
            items = parse_news_data_js(text)
        except Exception as exc:
            QMessageBox.critical(
                self,
                "Error al abrir",
                f"No pude leer o parsear el archivo.\n\n{exc}",
            )
            return

        self.file_path = path
        self.items = items
        self.populate_list()

        if self.items:
            self.news_list.setCurrentRow(0)
        else:
            self.add_news(select_new=True, mark_dirty=False)

        self._set_dirty(False)
        self._update_file_label()
        self.statusBar().showMessage(f"Archivo abierto: {path}", 3500)

    def save_file(self) -> bool:
        if self.file_path is None:
            return self.save_file_as()

        return self._save_to_path(self.file_path)

    def save_file_as(self) -> bool:
        suggested = str(self.file_path) if self.file_path else str(Path.cwd() / "news-data.js")

        file_name, _ = QFileDialog.getSaveFileName(
            self,
            "Guardar news-data.js",
            suggested,
            "JavaScript (*.js);;Todos los archivos (*.*)",
        )
        if not file_name:
            return False

        return self._save_to_path(Path(file_name))

    def _save_to_path(self, path: Path) -> bool:
        errors = self.validate_items()
        if errors:
            QMessageBox.warning(
                self,
                "Validación",
                "Hay detalles que deberías corregir antes de guardar:\n\n- " + "\n- ".join(errors)
            )

        try:
            ordered = sorted(
                self.items,
                key=lambda x: parse_iso_datetime_safe(x.created_at) or datetime.min,
                reverse=True,
            )
            data = serialize_news_data_js(ordered)
            path.write_text(data, encoding="utf-8", newline="\n")
        except Exception as exc:
            QMessageBox.critical(
                self,
                "Error al guardar",
                f"No pude guardar el archivo.\n\n{exc}",
            )
            return False

        self.file_path = path
        self.items = ordered
        self.populate_list()
        self._set_dirty(False)
        self._update_file_label()
        self.statusBar().showMessage(f"Guardado en {path}", 3500)
        return True

    # ---------- Data / list ----------
    def populate_list(self) -> None:
        current_id = self.current_item().id if self.current_item() else None

        self.news_list.clear()

        ordered = sorted(
            self.items,
            key=lambda x: parse_iso_datetime_safe(x.created_at) or datetime.min,
            reverse=True,
        )

        self.items = ordered

        selected_row = -1
        for row, item in enumerate(self.items):
            text = f"{item.pretty_date()}  |  {item.title or 'Sin título'}"
            if not item.published:
                text = f"[Oculta] {text}"

            list_item = QListWidgetItem(text)
            list_item.setData(Qt.UserRole, item.id)
            self.news_list.addItem(list_item)

            if current_id and item.id == current_id:
                selected_row = row

        if self.items:
            if selected_row >= 0:
                self.news_list.setCurrentRow(selected_row)
            elif self.news_list.currentRow() < 0:
                self.news_list.setCurrentRow(0)
        else:
            self.clear_form()
            self.refresh_preview()

    def current_index(self) -> int:
        row = self.news_list.currentRow()
        return row if 0 <= row < len(self.items) else -1

    def current_item(self) -> Optional[NewsItem]:
        idx = self.current_index()
        return self.items[idx] if idx >= 0 else None

    def add_news(self, *, select_new: bool = True, mark_dirty: bool = True) -> None:
        base_time = datetime.now().strftime("%Y-%m-%dT%H:%M:%S") + DEFAULT_TIMEZONE

        new_item = NewsItem(
            id=f"noticia-{len(self.items) + 1}",
            tag="update",
            title="Nueva noticia",
            excerpt="Resumen corto de la noticia.",
            created_at=base_time,
            published=True,
            body="<p>Escribe aquí el contenido completo de la noticia.</p>",
        )

        self.items.insert(0, new_item)
        self.populate_list()

        if select_new:
            for i, item in enumerate(self.items):
                if item.id == new_item.id:
                    self.news_list.setCurrentRow(i)
                    break

        if mark_dirty:
            self._set_dirty(True)

    def duplicate_current_news(self) -> None:
        current = self.current_item()
        if current is None:
            return

        copy_item = current.clone()
        copy_item.id = f"{current.id}-copy"
        copy_item.title = f"{current.title} (copia)"
        copy_item.created_at = datetime.now().strftime("%Y-%m-%dT%H:%M:%S") + DEFAULT_TIMEZONE

        self.items.insert(0, copy_item)
        self.populate_list()

        for i, item in enumerate(self.items):
            if item.id == copy_item.id:
                self.news_list.setCurrentRow(i)
                break

        self._set_dirty(True)
        self.statusBar().showMessage("Noticia duplicada.", 2500)

    def delete_current_news(self) -> None:
        idx = self.current_index()
        if idx < 0:
            return

        item = self.items[idx]
        answer = QMessageBox.question(
            self,
            "Eliminar noticia",
            f"¿Seguro que quieres eliminar:\n\n{item.title or item.id}?",
            QMessageBox.Yes | QMessageBox.No,
            QMessageBox.No,
        )
        if answer != QMessageBox.Yes:
            return

        del self.items[idx]
        self.populate_list()
        self._set_dirty(True)
        self.statusBar().showMessage("Noticia eliminada.", 2500)

    def validate_items(self) -> List[str]:
        errors: List[str] = []
        seen_ids = set()

        for item in self.items:
            if not item.id.strip():
                errors.append("Hay una noticia sin ID.")
            elif item.id in seen_ids:
                errors.append(f"ID duplicado: {item.id}")
            seen_ids.add(item.id)

            if not item.title.strip():
                errors.append(f"La noticia con ID '{item.id or '(vacío)'}' no tiene título.")

            if parse_iso_datetime_safe(item.created_at) is None:
                errors.append(f"La noticia '{item.title or item.id}' tiene un createdAt inválido: {item.created_at}")

            if item.tag not in {"update", "event", "maint"}:
                errors.append(f"La noticia '{item.title or item.id}' tiene un tag inválido: {item.tag}")

        return errors

    # ---------- Form ----------
    def clear_form(self) -> None:
        self._loading_form = True
        try:
            self.edit_id.clear()
            self.combo_tag.setCurrentText("update")
            self.check_published.setChecked(True)
            self.edit_title.clear()
            self.edit_excerpt.clear()
            self.edit_created.setDateTime(QDateTime.currentDateTime())
            self.edit_timezone.setText(DEFAULT_TIMEZONE)
            self.edit_body.clear()
        finally:
            self._loading_form = False

    def load_item_into_form(self, item: Optional[NewsItem]) -> None:
        self._loading_form = True
        try:
            if item is None:
                self.clear_form()
                return

            self.edit_id.setText(item.id)
            self.combo_tag.setCurrentText(item.tag if item.tag in {"update", "event", "maint"} else "update")
            self.check_published.setChecked(item.published)
            self.edit_title.setText(item.title)
            self.edit_excerpt.setPlainText(item.excerpt)

            dt, tz = self._split_created_at(item.created_at)
            self.edit_created.setDateTime(dt)
            self.edit_timezone.setText(tz)

            self.edit_body.setPlainText(item.body)
        finally:
            self._loading_form = False

        self.refresh_preview()

    def _split_created_at(self, value: str) -> Tuple[QDateTime, str]:
        dt = parse_iso_datetime_safe(value)
        if dt is None:
            return QDateTime.currentDateTime(), DEFAULT_TIMEZONE

        qdt = QDateTime(dt.year, dt.month, dt.day, dt.hour, dt.minute, dt.second)

        match = re.search(r"(Z|[+-]\d{2}:\d{2})$", value.strip())
        tz = match.group(1) if match else DEFAULT_TIMEZONE
        return qdt, tz

    def build_created_at_value(self) -> str:
        qdt = self.edit_created.dateTime()
        date_part = qdt.toString("yyyy-MM-ddTHH:mm:ss")
        tz = self.edit_timezone.text().strip() or DEFAULT_TIMEZONE

        if tz != "Z" and not re.fullmatch(r"[+-]\d{2}:\d{2}", tz):
            tz = DEFAULT_TIMEZONE

        return f"{date_part}{tz}"

    def on_list_selection_changed(self, row: int) -> None:
        item = self.items[row] if 0 <= row < len(self.items) else None
        self.load_item_into_form(item)

    def on_title_changed(self) -> None:
        self.on_form_changed()
        self.preview_timer.start()

    def on_form_changed(self) -> None:
        if self._loading_form:
            return

        item = self.current_item()
        if item is None:
            return

        item.id = self.edit_id.text().strip()
        item.tag = self.combo_tag.currentText().strip()
        item.published = self.check_published.isChecked()
        item.title = self.edit_title.text().strip()
        item.excerpt = self.edit_excerpt.toPlainText().strip()
        item.created_at = self.build_created_at_value()
        item.body = self.edit_body.toPlainText()

        self.update_current_list_item_text()
        self._set_dirty(True)
        self.preview_timer.start()

    def update_current_list_item_text(self) -> None:
        idx = self.current_index()
        if idx < 0:
            return

        item = self.items[idx]
        list_item = self.news_list.item(idx)
        if list_item is None:
            return

        text = f"{item.pretty_date()}  |  {item.title or 'Sin título'}"
        if not item.published:
            text = f"[Oculta] {text}"
        list_item.setText(text)

    def generate_id_from_title(self) -> None:
        title = self.edit_title.text().strip()
        if not title:
            QMessageBox.information(self, APP_TITLE, "Primero escribe un título.")
            return

        base = slugify(title)
        candidate = base
        suffix = 2
        existing = {item.id for item in self.items if item is not self.current_item()}

        while candidate in existing:
            candidate = f"{base}-{suffix}"
            suffix += 1

        self.edit_id.setText(candidate)
        self.statusBar().showMessage("ID generado desde el título.", 2200)

    def set_now(self) -> None:
        self.edit_created.setDateTime(QDateTime.currentDateTime())
        if not self.edit_timezone.text().strip():
            self.edit_timezone.setText(DEFAULT_TIMEZONE)
        self.on_form_changed()

    def insert_body_snippet(self, snippet: str) -> None:
        cursor = self.edit_body.textCursor()
        cursor.insertText(snippet)
        self.edit_body.setFocus()

    # ---------- Preview ----------
    def refresh_preview(self) -> None:
        selected = self.current_item()
        html_text = build_preview_html(self.items, selected)
        self.preview.setHtml(html_text)

    # ---------- Misc ----------
    def _set_dirty(self, value: bool) -> None:
        self._dirty = value
        self._update_window_title()

    def _update_window_title(self) -> None:
        suffix = " *" if self._dirty else ""
        file_label = str(self.file_path) if self.file_path else "sin-archivo"
        self.setWindowTitle(f"{APP_TITLE} — {file_label}{suffix}")

    def _update_file_label(self) -> None:
        self.lbl_file.setText(str(self.file_path) if self.file_path else "Sin archivo abierto")

    def closeEvent(self, event) -> None:  # type: ignore[override]
        if self.maybe_save():
            event.accept()
        else:
            event.ignore()


def main() -> None:
    app = QApplication(sys.argv)
    app.setApplicationName(APP_TITLE)

    font = QFont("Segoe UI", 10)
    app.setFont(font)

    window = MainWindow()
    window.show()

    sys.exit(app.exec())


if __name__ == "__main__":
    main()
