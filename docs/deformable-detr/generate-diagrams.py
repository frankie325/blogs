"""Regenerate the editable SVG figures for the Deformable DETR draft.

Run from any directory: python3 docs/deformable-detr/generate-diagrams.py
The figures are explanatory diagrams; their sampling points are not model data.
"""

from html import escape
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "public" / "images" / "deformable-detr"

INK = "#1c3047"
MUTED = "#65758a"
LINE = "#bcc9d8"
BLUE = "#3471c4"
BLUE_BG = "#edf4ff"
PURPLE = "#7055bb"
PURPLE_BG = "#f2efff"
ORANGE = "#ce7140"
ORANGE_BG = "#fff1e8"
GREEN = "#278a78"
GREEN_BG = "#e8f7f2"


class Diagram:
    def __init__(self, title, subtitle, height=690):
        self.height = height
        self.parts = [
            f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 {height}" role="img" aria-labelledby="title desc">',
            f'<title id="title">{escape(title)}</title>',
            f'<desc id="desc">{escape(subtitle)}</desc>',
            '<defs><marker id="arrow" markerWidth="9" markerHeight="9" refX="7.5" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#8799ae"/></marker></defs>',
            f'<rect width="1400" height="{height}" rx="24" fill="#f6f8fb"/>',
        ]
        self.text(54, 62, title, size=30, weight=700)
        self.text(54, 98, subtitle, size=19, fill=MUTED)

    def add(self, element):
        self.parts.append(element)

    def rect(self, x, y, width, height, fill="white", stroke="#dae3ec", radius=17):
        self.add(f'<rect x="{x}" y="{y}" width="{width}" height="{height}" rx="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="2"/>')

    def text(self, x, y, value, size=21, fill=INK, weight=400, anchor="start"):
        self.add(f'<text x="{x}" y="{y}" fill="{fill}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}" font-family="-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif">{escape(value)}</text>')

    def circle(self, x, y, radius, fill, stroke="none", width=2):
        self.add(f'<circle cx="{x}" cy="{y}" r="{radius}" fill="{fill}" stroke="{stroke}" stroke-width="{width}"/>')

    def line(self, x1, y1, x2, y2, color=LINE, width=2, arrow=False, dash=None):
        marker = ' marker-end="url(#arrow)"' if arrow else ""
        dashed = f' stroke-dasharray="{dash}"' if dash else ""
        self.add(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{width}"{marker}{dashed}/>')

    def path(self, d, color=LINE, width=2.5, arrow=False, dash=None):
        marker = ' marker-end="url(#arrow)"' if arrow else ""
        dashed = f' stroke-dasharray="{dash}"' if dash else ""
        self.add(f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{width}" stroke-linejoin="round" stroke-linecap="round"{marker}{dashed}/>')

    def card(self, x, y, width, height, title, subtitle, fill="white", color=INK):
        self.rect(x, y, width, height, fill=fill)
        self.text(x + 20, y + 39, title, size=23, fill=color, weight=700)
        for i, value in enumerate(subtitle):
            self.text(x + 20, y + 73 + 28 * i, value, size=18, fill=MUTED)

    def save(self, name):
        OUT.mkdir(parents=True, exist_ok=True)
        (OUT / name).write_text("\n".join(self.parts + ["</svg>", ""]), encoding="utf-8")


def dense_vs_sparse():
    d = Diagram("稠密注意力与可变形采样", "示意：左侧访问全部网格位置；右侧只展示一个头、一个尺度的 4 个采样点。", 690)
    d.rect(40, 135, 640, 465)
    d.rect(720, 135, 640, 465)
    d.text(68, 178, "标准稠密注意力", size=25, weight=700)
    d.text(748, 178, "多尺度可变形注意力", size=25, weight=700)
    d.text(68, 210, "Query 与每个特征位置建立关系", size=18, fill=MUTED)
    d.text(748, 210, "以参考点为起点，只读取少量位置", size=18, fill=MUTED)

    for x, label in [(93, "Q"), (773, "Q")]:
        d.circle(x, 375, 31, PURPLE_BG, PURPLE, 3)
        d.text(x, 383, label, size=24, fill=PURPLE, weight=700, anchor="middle")

    grid_left = [(335 + col * 48, 265 + row * 48) for row in range(5) for col in range(6)]
    grid_right = [(1015 + col * 48, 265 + row * 48) for row in range(5) for col in range(6)]
    for x, y in grid_left:
        d.line(125, 375, x, y, color="#d0dcf0", width=1.5)
        d.circle(x, y, 7, BLUE)
    for x, y in grid_right:
        d.circle(x, y, 7, "#afc3df")
    reference = (1135, 360)
    samples = [(1088, 285), (1197, 307), (1233, 404), (1082, 432)]
    d.line(805, 375, *reference, color=PURPLE, width=2, dash="6 6")
    for x, y in samples:
        d.line(*reference, x, y, color=ORANGE, width=3)
        d.circle(x, y, 11, ORANGE_BG, ORANGE, 3)
    d.circle(*reference, 11, PURPLE, "white", 3)
    d.text(94, 548, "空间位置越多，稠密交互越多", size=19, fill=MUTED)
    d.circle(793, 548, 8, PURPLE)
    d.text(811, 555, "参考点", size=19, fill=MUTED)
    d.circle(915, 548, 8, ORANGE_BG, ORANGE, 2)
    d.text(933, 555, "采样位置", size=19, fill=MUTED)
    d.line(1055, 548, 1090, 548, color=ORANGE, width=3)
    d.text(1102, 555, "采样偏移", size=19, fill=MUTED)
    d.save("dense-vs-sparse.svg")


def network_overview():
    d = Diagram("单阶段 Deformable DETR：前向路径", "蓝色为图像特征路径，紫色为 Query 与参考点路径。图中展示本地默认的单阶段、无逐层框精修模式。", 760)
    d.text(54, 145, "01  图像特征", size=18, fill=BLUE, weight=700)
    y = 165
    d.card(45, y, 175, 155, "输入图片", ["B × 3 × H × W"], BLUE_BG, BLUE)
    d.card(265, y, 185, 155, "Backbone", ["ResNet-50", "C3 / C4 / C5"], BLUE_BG, BLUE)
    d.card(495, y, 215, 155, "多尺度特征", ["投影 + C6", "位置 / 层级 / mask"], BLUE_BG, BLUE)
    d.card(755, y, 230, 155, "Encoder × 4", ["可变形自注意力", "FFN"], BLUE_BG, BLUE)
    d.card(1030, y, 250, 155, "Memory", ["多尺度编码特征", "[B, 1700, 128] *"], BLUE_BG, BLUE)
    for a, b in [(220, 265), (450, 495), (710, 755), (985, 1030)]:
        d.line(a + 4, 242, b - 6, 242, arrow=True)

    d.text(54, 384, "02  OBJECT QUERY 与检测", size=18, fill=PURPLE, weight=700)
    y = 410
    d.card(45, y, 180, 155, "Query 向量", ["可学习的初始表示"], PURPLE_BG, PURPLE)
    d.card(270, y, 205, 155, "拆分", ["query_pos", "tgt（初始内容）"], PURPLE_BG, PURPLE)
    d.card(520, y, 205, 155, "初始参考点", ["Linear + Sigmoid", "(x, y)"], PURPLE_BG, PURPLE)
    d.card(770, y, 260, 155, "Decoder × 4", ["普通自注意力", "可变形交叉注意力 + FFN"], PURPLE_BG, PURPLE)
    d.card(1075, y, 205, 155, "预测头", ["分类 logits", "归一化 (cx,cy,w,h)"], GREEN_BG, GREEN)
    for a, b in [(225, 270), (475, 520), (725, 770), (1030, 1075)]:
        d.line(a + 4, 487, b - 6, 487, arrow=True)
    d.path("M 1155 320 V 365 H 900 V 405", color=BLUE, arrow=True)
    d.text(925, 356, "memory → 交叉注意力", size=17, fill=BLUE)
    d.path("M 372 565 V 615 H 900 V 570", color=PURPLE, arrow=True)
    d.text(510, 646, "tgt / query_pos → Decoder", size=17, fill=PURPLE)
    d.text(54, 708, "* 张量示例：B=2，输入 256×320，无 padding；不同输入尺寸会改变空间位置数。", size=18, fill=MUTED)
    d.save("network-overview.svg")


def multiscale_flatten():
    d = Diagram("从多尺度特征图到 Encoder 序列", "示例：输入 256×320、无 padding，投影通道 D=128；C6 由原始 C5 经步长为 2 的卷积生成。", 760)
    cards = [
        (45, "C3", "stride 8 · 32×40", "1×1 投影 → 128 维", "1280 个位置", BLUE_BG),
        (375, "C4", "stride 16 · 16×20", "1×1 投影 → 128 维", "320 个位置", "#e9f5fb"),
        (705, "C5", "stride 32 · 8×10", "1×1 投影 → 128 维", "80 个位置", "#f0f0ff"),
        (1035, "C6", "stride 64 · 4×5", "3×3 / 2 卷积 → 128 维", "20 个位置", "#f6efff"),
    ]
    for x, name, size, projection, count, fill in cards:
        d.rect(x, 150, 300, 205, fill=fill)
        d.text(x + 24, 190, name, size=26, fill=BLUE, weight=700)
        d.text(x + 24, 230, size, size=19)
        d.text(x + 24, 265, projection, size=18, fill=MUTED)
        d.text(x + 24, 305, count, size=20, weight=700)
        d.line(x + 150, 357, x + 150, 404, arrow=True)

    d.text(54, 435, "逐层展平并拼接：src_flatten [2, 1700, 128]", size=23, weight=700)
    colors = ["#bdd4f7", "#c5e8f2", "#d0d1f5", "#e4d4f4"]
    for i, (name, start) in enumerate([("C3", 0), ("C4", 1280), ("C5", 1600), ("C6", 1680)]):
        x = 54 + i * 322
        d.rect(x, 455, 308, 74, fill=colors[i], stroke=colors[i], radius=8)
        d.text(x + 154, 501, f"{name}  ·  起点 {start}", size=19, fill=INK, weight=700, anchor="middle")
    d.text(54, 558, "色块长度为示意，不按位置数量等比例绘制。", size=17, fill=MUTED)
    d.rect(54, 585, 620, 89, fill="white")
    d.text(76, 620, "spatial_shapes + level_start_index", size=20, weight=700)
    d.text(76, 651, "记录各层尺寸和序列起点", size=18, fill=MUTED)
    d.rect(705, 585, 620, 89, fill="white")
    d.text(727, 620, "位置 / 层级编码 + mask / valid_ratios", size=20, weight=700)
    d.text(727, 651, "为空间位置、尺度与有效区域提供配套信息", size=18, fill=MUTED)
    d.save("multiscale-flatten.svg")


def attention_flow():
    d = Diagram("多尺度可变形注意力：一个 Query 的数据流", "偏移与权重由 Query 预测；参考点确定起点；Value 从多尺度特征中采样。", 750)
    d.card(45, 265, 220, 120, "Query", ["特征 + 位置表示"], PURPLE_BG, PURPLE)
    d.card(315, 135, 220, 100, "Linear", ["采样偏移 Δp"], ORANGE_BG, ORANGE)
    d.card(315, 455, 220, 115, "Linear + Softmax", ["采样权重 A"], GREEN_BG, GREEN)
    d.card(315, 295, 220, 115, "参考点 r", ["映射至各特征层"], PURPLE_BG, PURPLE)
    d.card(615, 135, 225, 115, "采样位置 s", ["r + Δp / (W,H)"], ORANGE_BG, ORANGE)
    d.card(615, 455, 225, 115, "多尺度 Value", ["Value 投影 + mask"], BLUE_BG, BLUE)
    d.card(900, 245, 210, 130, "双线性采样", ["每头 / 每尺度", "读取采样位置"], BLUE_BG, BLUE)
    d.card(1150, 245, 205, 130, "加权聚合", ["跨层与点求和", "合并各头并投影"], GREEN_BG, GREEN)
    d.path("M 265 305 H 285 V 185 H 310", color=PURPLE, arrow=True)
    d.path("M 265 345 H 285 V 512 H 310", color=PURPLE, arrow=True)
    d.line(540, 185, 610, 185, color=ORANGE, width=3, arrow=True)
    d.path("M 535 352 H 570 V 218 H 610", color=PURPLE, arrow=True)
    d.path("M 840 192 H 875 V 290 H 895", color=ORANGE, arrow=True)
    d.path("M 840 512 H 1005 V 380", color=BLUE, arrow=True)
    d.path("M 535 512 H 570 V 635 H 1253 V 380", color=GREEN, arrow=True)
    d.line(1110, 310, 1145, 310, color=BLUE, width=3, arrow=True)
    d.text(52, 689, "二维参考点分支示意。每个头对全部尺度与采样点的权重共同归一化；各头分别聚合。", size=18, fill=MUTED)
    d.save("attention-flow.svg")


def reference_points():
    d = Diagram("参考点从哪里来？", "Encoder 的参考点来自网格中心；单阶段 Decoder 的初始参考点来自可学习 Query 的位置部分。", 730)
    d.rect(40, 140, 640, 485)
    d.rect(720, 140, 640, 485)
    d.text(70, 185, "ENCODER", size=23, fill=BLUE, weight=700)
    d.text(750, 185, "DECODER · 单阶段", size=23, fill=PURPLE, weight=700)
    d.text(70, 222, "特征网格位置 → 网格中心", size=20)
    d.text(750, 222, "可学习 Query embedding → query_pos", size=20)
    for row in range(4):
        for col in range(5):
            x, y = 105 + col * 44, 280 + row * 44
            d.rect(x, y, 36, 36, fill=BLUE_BG, stroke="#c7d9ed", radius=3)
    d.circle(211, 342, 9, PURPLE, "white", 2)
    d.line(335, 348, 385, 348, arrow=True)
    d.card(395, 280, 235, 140, "网格中心", ["相对有效区域归一化", "映射到各特征层"], BLUE_BG, BLUE)
    d.card(760, 280, 225, 140, "query_pos", ["可学习位置表示", "Linear + Sigmoid"], PURPLE_BG, PURPLE)
    d.line(990, 348, 1030, 348, arrow=True)
    d.card(1040, 280, 245, 140, "二维参考点", ["初始 (x, y)", "映射到各特征层"], PURPLE_BG, PURPLE)
    d.text(70, 494, "参考点用于组织采样，不是采样偏移。", size=19, fill=MUTED)
    d.text(750, 494, "初始点由 Query 得到，不依赖当前图片。", size=19, fill=MUTED)
    d.text(70, 555, "有效区域比例 valid_ratios 用于尺度间映射。", size=18, fill=MUTED)
    d.text(750, 555, "默认关闭逐层框精修，参考点不逐层更新。", size=18, fill=MUTED)
    d.save("reference-points.svg")


if __name__ == "__main__":
    dense_vs_sparse()
    network_overview()
    multiscale_flatten()
    attention_flow()
    reference_points()
    print(f"Wrote five SVG diagrams to {OUT}")
