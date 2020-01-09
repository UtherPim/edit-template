<template>
  <div id="abc">
    <el-container style="height: 100vh">
      <el-container style="height: 100%">
        <el-aside width="70px">
          <el-button @click="createEditDiv">文本</el-button>
          <el-popover
            placement="right"
            width="300"
            trigger="hover"
          >
            <el-button-group>
              <el-button size="small" @click="selectTable(2, 1)">2x1</el-button>
              <el-button size="small" @click="selectTable(2, 2)">2x2</el-button>
              <el-button size="small" @click="selectTable(2, 3)">2x3</el-button>
              <el-button size="small" @click="selectTable(2, 4)">2x4</el-button>
              <el-button size="small" @click="selectTable(2, 5)">2x5</el-button>
            </el-button-group>
            <el-button-group>
              <el-button size="small" @click="selectTable(3, 1)">3x1</el-button>
              <el-button size="small" @click="selectTable(3, 2)">3x2</el-button>
              <el-button size="small" @click="selectTable(3, 3)">3x3</el-button>
              <el-button size="small" @click="selectTable(3, 4)">3x4</el-button>
              <el-button size="small" @click="selectTable(3, 5)">3x5</el-button>
            </el-button-group>
            <el-button-group>
              <el-button size="small" @click="selectTable(4, 1)">4x1</el-button>
              <el-button size="small" @click="selectTable(4, 2)">4x2</el-button>
              <el-button size="small" @click="selectTable(4, 3)">4x3</el-button>
              <el-button size="small" @click="selectTable(4, 4)">4x4</el-button>
              <el-button size="small" @click="selectTable(4, 5)">4x5</el-button>
            </el-button-group>
            <el-button slot="reference">表格</el-button>
          </el-popover>
          <el-button @click="createEditDivForImg">图片</el-button>
          <el-button style="padding-left: 13px;padding-right: 13px" @click="createEditDivForQRCode">二维码</el-button>
          <el-button @click="templateVisible = true">模板</el-button>
          <!--          <button><input id="insertImg" type="file" accept="image/gif, image/jpeg, image/png" hidden @change="insertImg">图片</button>-->
        </el-aside>
        <el-container style="padding: 30px;overflow: hidden;position: relative">
          <canvas id="rulerCanvas" width="1960px" height="1080px" style="position: absolute;left: 10px;top: 10px" />
          <div id="editor" :style="{position: 'relative', width: editorWidth + 'px', height: editorHeight + 'px', boxShadow: '0px 0px 2px #7e8c8d', overflow: 'hidden'}" @click="handleEditorClick">
            <vue-draggable-resizable
              v-for="(item, index) in dragResizeArr"
              :key="item.id"
              :x="item.x"
              :y="item.y"
              :w="item.width"
              :h="item.height"
              :min-width="35"
              :min-height="35"
              :draggable="item.isDragble"
              :class-name="item.classes"
              @dragging="onDrag"
              @resizing="onResize"
              @dblclick.native="handleDbClick(item)"
              @activated="onActivated(item, index)"
              @deactivated="onDeactivated(item)"
            >
              <div
                :id="item.id"
                :contenteditable="item.isEditable"
                :style="{
                  width: '100%',
                  height: '100%',
                  padding: '2px',
                  overflow: 'hidden',
                  fontSize: item.fontSize + 'pt',
                  fontFamily: item.fontFamily,
                  color: item.fontColor,
                  lineHeight: item.lineHeight,
                  boxSizing: 'border-box',
                  border: `${item.borderSize}px solid ${item.borderColor}`
                }"
                @contextmenu.prevent="rightClickHandler('text')"
              >
                {{ item.textValue }}
              </div>
            </vue-draggable-resizable>
            <template v-if="dragResizeTableArr">
              <vue-draggable-resizable
                v-for="(item, index) in dragResizeTableArr"
                :key="item.id"
                :x="item.x"
                :y="item.y"
                :w="item.width"
                :h="item.height"
                :min-width="50"
                :min-height="50"
                :parent="true"
                :draggable="item.isDragble"
                :class-name="item.classes"
                @dragging="onDrag"
                @resizing="onResize"
                @dblclick.native="handleDbClick(item)"
                @activated="onActivated(item, index)"
                @deactivated="onDeactivated(item)"
              >
                <table
                  :id="item.id"
                  :border="item.borderSize"
                  cellspacing="0"
                  cellpadding="0"
                  :contenteditable="item.isEditable"
                  :style="{
                    width: '100%',
                    height: '100%',
                    fontSize: item.fontSize,
                    fontFamily: item.fontFamily,
                    color: item.fontColor,
                    lineHeight: item.lineHeight,
                    boxSizing: 'border-box',
                    borderCollapse: 'collapse',
                    border: `${item.borderSize}px solid ${item.borderColor}`
                  }"
                  @contextmenu.prevent="rightClickHandler('table')"
                >
                  <tbody>
                    <tr v-for="(row, rowInd) in item.trs" :key="rowInd">
                      <td v-for="(col, colInd) in row" :key="rowInd + colInd + col">{{ col }}</td>
                    </tr>
                  </tbody>
                </table>
              </vue-draggable-resizable>
            </template>
            <template v-if="dragResizeImgArr">
              <vue-draggable-resizable
                v-for="(item, index) in dragResizeImgArr"
                :key="item.id"
                :x="item.x"
                :y="item.y"
                :w="item.width"
                :h="item.height"
                :min-width="35"
                :min-height="35"
                :parent="true"
                :draggable="item.isDragble"
                :class-name="item.classes"
                @dragging="onDrag"
                @resizing="onResize"

                @activated="onActivated(item, index)"
                @deactivated="onDeactivated(item)"
              >
                <div
                  :id="item.id"
                  :contenteditable="item.isEditable"
                  :style="{
                    width: '100%',
                    height: '100%',
                    padding: '2px',
                    overflow: 'hidden',
                    boxSizing: 'border-box',
                    border: `${item.borderSize}px solid ${item.borderColor}`
                  }"
                  @contextmenu.prevent="rightClickHandler('img')"
                  @dblclick="uploadImg(index)"
                >
                  <svg-icon icon-class="upload-img" :class="{'display-none': insertImg[index] === 1? false : true}" style="width: 80%;height: 80%;margin: 10% auto"/>
<!--                  <i :class="{'el-icon-plus': true, 'display-none': insertImg[index] === 1? false : true}" style="width: 100%;height: 100%"></i>-->
                  <img :src="insertImg[index]" style="width: 100%;height: 100%" alt="">
                  <input :ref="'img' + index" type="file" name="file" style="display: none" @change="getImgFile(index)">
                </div>
              </vue-draggable-resizable>
            </template>
            <template v-if="dragResizeQRCodeArr">
              <vue-draggable-resizable
                      v-for="(item, index) in dragResizeQRCodeArr"
                      :key="item.id"
                      :x="item.x"
                      :y="item.y"
                      :w="item.width"
                      :h="item.height"
                      :min-width="35"
                      :min-height="35"
                      :parent="true"
                      :draggable="item.isDragble"
                      :class-name="item.classes"
                      @dragging="onDrag"
                      @resizing="onResize"
                      @dblclick.native="handleDbClick(item)"
                      @activated="onActivated(item, index)"
                      @deactivated="onDeactivated(item)"
              >
                <div
                        :id="item.id"
                        :contenteditable="item.isEditable"
                        :style="{
                   width: '100%',
                   height: '100%',
                   padding: '2px',
                   overflow: 'hidden',
                   fontSize: item.fontSize + 'pt',
                   fontFamily: item.fontFamily,
                   color: item.fontColor,
                   lineHeight: item.lineHeight,
                   boxSizing: 'border-box',
                   border: `${item.borderSize}px solid ${item.borderColor}`
                  }"
                        @contextmenu.prevent="rightClickHandler('QRCode')"
                >
                  <img :src="require('../../../src/assets/QRCode.jpg')" alt="二维码" style="width: 100%;height: 100%">
                </div>
              </vue-draggable-resizable>
            </template>
            <el-card v-show="rightClickVisible" :style="{width: '80px',position: 'absolute',left: xPx - 80 + 'px',top: yPx + heightPx + 'px'}" body-style="padding: 8px">
              <CellGroup>
                <el-button size="small" style="width: 100%" @click="handleDeleteItem">删除</el-button>
                <el-button size="small" style="width: 100%" @click="execCommand('bold')"><svg-icon icon-class="bold" /></el-button>
                <el-button size="small" style="width: 100%" @click="execCommand('italic')"><svg-icon icon-class="Italic" /></el-button>
                <el-button size="small" style="width: 100%" @click="execCommand('underline')"><svg-icon icon-class="underline" /></el-button>
                <el-button size="small" style="width: 100%" @click="execCommand('strikeThrough')"><svg-icon icon-class="strikethrough" /></el-button>
              </CellGroup>
            </el-card>
          </div>
        </el-container>
        <el-aside width="360px" style="height: 100%">
          <div style="display: flex; justify-content: space-between;height: 100%;overflow: hidden">
            <el-card style="width: 20%;height: 100%">
              <el-tooltip class="item" effect="dark" content="撤销" placement="right">
                <svg-icon icon-class="undo" @click="execCommand('undo')" />
              </el-tooltip>
              <el-divider />
              <el-tooltip class="item" effect="dark" content="恢复" placement="right">
                <svg-icon icon-class="redo" title="恢复" @click="execCommand('redo')" />
              </el-tooltip>
              <el-divider />
              <el-tooltip class="item" effect="dark" content="预览" placement="right">
                <svg-icon icon-class="preview" title="预览" @click="preView" />
              </el-tooltip>
              <el-divider />
              <el-tooltip class="item" effect="dark" content="打印" placement="right">
                <svg-icon icon-class="printer" title="打印" @click="doPrint" />
              </el-tooltip>
              <el-divider />
              <el-tooltip class="item" effect="dark" content="保存" placement="right">
                <svg-icon icon-class="save" title="保存" @click="handleSave" />
              </el-tooltip>
                          <!--              <el-divider />-->
                          <!--              <el-tooltip class="item" effect="dark" content="保存为默认模板" placement="right">-->
                          <!--                <svg-icon icon-class="button-save-default" title="保存为默认模板" @click="handleSaveAsDefault" />-->
                          <!--              </el-tooltip>-->
            </el-card>
            <transition name="slide-fade">
              <el-card v-if="show" style="width: 80%;overflow-y: auto;text-align: left">
                <el-input v-model="editorWidth" placeholder="请输入内容" size="small" @change="handleEditorWidth">
                  <template slot="prepend">编辑区长</template>
                  <template slot="append">px</template>
                </el-input>
                <el-input v-model="editorHeight" placeholder="请输入内容" size="small" @change="handleEditorHeight">
                  <template slot="prepend">编辑区宽</template>
                  <template slot="append">px</template>
                </el-input>
                <el-input v-model="xPx" placeholder="请输入内容" size="small" @change="handleLeft">
                  <template slot="prepend">控件左边距</template>
                  <template slot="append">px</template>
                </el-input>
                <el-input v-model="yPx" placeholder="请输入内容" size="small" @change="handleTop">
                  <template slot="prepend">控件上边距</template>
                  <template slot="append">px</template>
                </el-input>
                <el-input v-model="widthPx" placeholder="请输入内容" size="small" @change="handleWidth">
                  <template slot="prepend">控件宽度</template>
                  <template slot="append">px</template>
                </el-input>
                <el-input v-model="heightPx" placeholder="请输入内容" size="small" @change="handleHeight">
                  <template slot="prepend">控件高度</template>
                  <template slot="append">px</template>
                </el-input>
                <!--                <el-button size="medium" @click="execCommand('selectAll')">全选</el-button>-->
                <el-button-group style="margin-bottom: 5px">
                  <el-button size="medium" @click="execCommand('justifyLeft')"><svg-icon icon-class="alignLeft" /></el-button>
                  <el-button size="medium" @click="execCommand('justifyRight')"><svg-icon icon-class="alignRight" /></el-button>
                  <el-button size="medium" @click="execCommand('justifyCenter')"><svg-icon icon-class="alignCenter" /></el-button>
                  <el-button size="medium" @click="execCommand('indent')"><svg-icon icon-class="indent" /></el-button>
                </el-button-group>
                <el-button size="medium" style="margin-bottom: 5px" @click="execCommand('insertHorizontalRule')">插入水平线</el-button>
                <el-button-group style="margin-bottom: 5px">
                  <el-button size="medium" @click="execCommand('bold')"><svg-icon icon-class="bold" /></el-button>
                  <el-button size="medium" @click="execCommand('italic')"><svg-icon icon-class="Italic" /></el-button>
                  <el-button size="medium" @click="execCommand('underline')"><svg-icon icon-class="underline" /></el-button>
                  <el-button size="medium" @click="execCommand('strikeThrough')"><svg-icon icon-class="strikethrough" /></el-button>
                  <el-button size="medium" @click="execCommand('superscript')"><svg-icon icon-class="superscript" /></el-button>
                  <el-button size="medium" @click="execCommand('subscript')"><svg-icon icon-class="subscript" /></el-button>
                </el-button-group>
                <el-button-group style="margin-bottom: 5px">
                  <el-button size="medium" @click="execCommand('formatBlock', '<h1>')">H1</el-button>
                  <el-button size="medium" @click="execCommand('formatBlock', '<h2>')">H2</el-button>
                  <el-button size="medium" @click="execCommand('formatBlock', '<h3>')">H3</el-button>
                  <el-button size="medium" @click="execCommand('formatBlock', '<h4>')">H4</el-button>
                  <el-button size="medium" @click="execCommand('formatBlock', '<h5>')">H5</el-button>
                  <el-button size="medium" @click="execCommand('formatBlock', '<h6>')">H6</el-button>
                </el-button-group>
<!--                <el-button size="medium" @click="execCommand('removeFormat')">移除所有修改</el-button>-->
                <div style="margin-bottom: 5px">
                  <span>字体：</span>
                  <el-select v-model="fontValue" placeholder="请选择" size="small" style="display: inline-block;width: 75%" @change="handleFontFamilyChange">
                    <el-option
                      v-for="item in fontFamilys"
                      :key="item.fontValue"
                      :label="item.fontName"
                      :value="item.fontValue"
                      :style="{fontFamily: item.fontValue}"
                    />
                  </el-select>
                </div>
                <div>
                  <span>文字颜色及大小</span>
                </div>
                <el-color-picker
                  v-model="color"
                  size="small"
                  color-format="hex"
                  :predefine="predefineColors"
                  @change="handleColorChange"
                />
                <el-input v-model="fontSize" placeholder="请输入内容" size="small" @change="handleFontSizeChange">
                  <template slot="append">pt</template>
                </el-input>
                <div>
                  <span>边框颜色及尺寸</span>
                </div>
                <el-color-picker
                  v-model="borderColor"
                  color-format="hex"
                  :predefine="predefineColors"
                  @change="handleBorderColorChange"
                />
                <el-input v-model="borderSize" placeholder="请输入内容" size="small" @change="handleBorderSizeChange">
                  <template slot="append">px</template>
                </el-input>
                <!--                <el-input v-model="whoIsChecked.textValue" placeholder="请输入内容" size="small">-->
                <!--                  <template slot="prepend">内容</template>-->
                <!--                </el-input>-->
              </el-card>
            </transition>
          </div>
        </el-aside>
      </el-container>
    </el-container>
    <el-dialog
      :visible.sync="dialogVisible"
      width="800px"
    >
      <div id="preview" style="min-height: 600px;width: 100%" />
    </el-dialog>
    <el-dialog
      :visible.sync="templateVisible"
      title="模板库"
      width="70%"
      @opened="getTemPlates"
    >
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="普通打印模板" name="common" style="width: 100%">
          <template v-if="templates.length>0">
            <el-card
              body-style="width: 100%;display: flex;justify-content: flex-start;flex-wrap: wrap"
              height="800px"
            >
              <el-card
                v-for="template in templates"
                :key="template.templateId"
                shadow="hover"
                style="width: 150px;height: 200px;margin-right: 10px;margin-top: 10px;position: relative;padding: 0"
              >
                {{ template.templateTitle }}
                <el-tooltip class="item" effect="dark" content="设置为默认模板" placement="top-start">
                  <el-button icon="el-icon-star-off" :type="template.templateId === defaultTempForCommon.templateId?'warning':''" size="small" circle style="position: absolute;top: 10px;right: 10px" @click="setDefaultTemplate(template)" />
                </el-tooltip>
                <el-button icon="el-icon-delete" size="small" circle style="position: absolute;bottom: 10px;right: 10px" type="danger" @click="handleDeleteTemplate(template)" />
                <el-button icon="el-icon-edit" size="small" circle style="position: absolute;bottom: 10px;right: 50px" type="primary" @click="handleEditTemplate(template)" />
                <!--<el-popover
                  @show="getTempImg(template)"
                  placement="top-start"
                  trigger="hover">
                  <img :src="imgBase64" alt="预览图">
                  <el-button slot="reference" icon="el-icon-view" size="small" circle style="position: absolute;bottom: 10px;right: 90px" @click="handleSelectTemplate(template)" />
                </el-popover>-->
                <el-button icon="el-icon-view" size="small" circle style="position: absolute;bottom: 10px;right: 90px" @click="handleSelectTemplate(template)" />
              </el-card>
            </el-card>
          </template>
          <template v-else>
            暂未有已设计模板
          </template>
        </el-tab-pane>
        <el-tab-pane label="热敏打印模板" name="thermal">
          <template v-if="templatesForThermal.length>0">
            <el-card
              body-style="width: 100%;display: flex;justify-content: flex-start;flex-wrap: wrap"
              height="800px"
            >
              <el-card
                v-for="template in templatesForThermal"
                :key="template.templateId"
                shadow="hover"
                style="width: 150px;height: 200px;margin-right: 10px;margin-top: 10px;position: relative;padding: 0"
              >
                {{ template.templateTitle }}
                <el-tooltip class="item" effect="dark" content="设置为默认模板" placement="top-start">
                  <el-button icon="el-icon-star-off" :type="template.templateId === defaultTempForThermal.templateId?'warning':''" size="small" circle style="position: absolute;top: 10px;right: 10px" @click="setDefaultTemplate(template)" />
                </el-tooltip>
                <el-button icon="el-icon-delete" size="small" circle style="position: absolute;bottom: 10px;right: 10px" type="danger" @click="handleDeleteTemplate(template)" />
                <el-button icon="el-icon-edit" size="small" circle style="position: absolute;bottom: 10px;right: 50px" type="primary" @click="handleEditTemplate(template)" />
                <!--<el-popover
                  @show="getTempImg(template)"
                  placement="top-start"
                  trigger="hover">
                  <img :src="imgBase64" alt="预览图">
                  <el-button slot="reference" icon="el-icon-view" size="small" circle style="position: absolute;bottom: 10px;right: 90px" @click="handleSelectTemplate(template)" />
                </el-popover>-->
                <el-button icon="el-icon-view" size="small" circle style="position: absolute;bottom: 10px;right: 90px" @click="handleSelectTemplate(template)" />
              </el-card>
            </el-card>
          </template>
          <template v-else>
            暂未有已设计模板
          </template>
        </el-tab-pane>
      </el-tabs>
      <template v-if="templates.length>0">
        <span slot="footer" class="dialog-footer">
          <div style="margin-top: 20px;">
            <el-pagination
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="prev, pager, next, jumper"
              :total="total"
              @current-change="handleCurrentChange"
            />
          </div>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      :visible.sync="saveVisible"
      :width="editorWidth"
    >
<!--      <div id="savePreview" style="min-height: 600px;width: 100%" />-->
      标题：<el-input v-model="title" placeholder="请输入标题" style="display: inline-block;width: 60%" />
      <div style="display: block">
        打印类型：
        <el-radio-group v-model="templateType" size="small">
          <el-radio-button label="common">正常</el-radio-button>
          <el-radio-button label="thermal">热敏</el-radio-button>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSave">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="addVisible"
      :width="editorWidth"
    >
<!--      <div id="addPreview" style="min-height: 600px;width: 100%" />-->
      标题：<el-input v-model="title" placeholder="请输入标题" style="display: inline-block;width: 60%" />
      <div style="display: block">
        打印类型：
        <el-radio-group v-model="templateType" size="small">
          <el-radio-button label="common">正常</el-radio-button>
          <el-radio-button label="thermal">热敏</el-radio-button>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="saveVisible = false">取 消</el-button>
        <el-button type="primary" @click="doAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import Vue from 'vue'
import VueDraggableResizable from 'vue-draggable-resizable'
import { CellGroup, Cell } from 'view-design'
import 'jquery-ui/ui/widgets/resizable'
import fontFamilys from '@/assets/font/font-family.js'
import CanvasRuler from './ruler'
// import draggable from 'vuedraggable'
import { UnitConversion } from '@/utils'
import { upTemplate, getTemplateData, changeDefaultTemp, getDefaultTemp } from '@/api/template'
import 'vue-draggable-resizable/dist/VueDraggableResizable.css'

Vue.component('vue-draggable-resizable', VueDraggableResizable)
Vue.component('CellGroup', CellGroup)
Vue.component('Cell', Cell)

export default {
  name: 'TemplateManage',
  components: {},
  props: {
    needEditTemp: Object
  },
  data() {
    return {
      fontValue: 'SimSun',
      fontFamilys,
      id: '',
      rightClickVisible: false,
      show: true,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      xPx: 0,
      yPx: 0,
      widthPx: 0,
      heightPx: 0,
      textValue: 'TEXT',
      fontSize: '14',
      borderSize: 0,
      borderColor: '#000',
      dialogVisible: false,
      dragResizeArr: [{
        elName: 'div',
        isShow: true,
        id: 0,
        x: 0,
        y: 0,
        width: 200,
        height: 35,
        classes: '',
        textValue: 'TEXT',
        isDragble: true,
        fontSize: '14',
        fontFamily: 'SimSun',
        fontColor: '#000',
        lineHeight: '30px',
        borderSize: 1,
        borderColor: '#000',
        isEditable: false
      }],
      dragResizeTableArr: [],
      dragResizeQRCodeArr: [],
      dragResizeImgArr: [],
      whoIsChecked: null,
      whoIsCheckedIndex: 0,
      whichTypeIsSelected: 'text',
      color: 'rgba(0, 0, 0)',
      predefineColors: ['#ff8c00', '#ffd700', '#00ced1', '#c71585', 'rgba(255, 69, 0)', 'rgb(255, 120, 0)', 'hsv(51, 100, 98)', 'hsva(120, 40, 94)', 'hsl(181, 100%, 37%)', 'hsla(209, 100%, 56%)'],
      templateVisible: false,
      templates: [],
      templatesForThermal: [],
      saveVisible: false,
      title: '',
      elementArr: [],
      currentPage: 1,
      pageNum: 1,
      pageSize: 10,
      total: 0,
      imgBase64: '',
      defaultTempForCommon: {},
      defaultTempForThermal: {},
      activeName: 'common',
      templateType: 'common',
      editorWidth: '800',
      editorWidth2mm: parseInt(new UnitConversion().pxConversionMm(500)),
      editorHeight: '600',
      editorHeight2mm: parseInt(new UnitConversion().pxConversionMm(500)),
      textContent: '',
      selectTemp: {},
      addVisible: false,
      saveTempDisable: !this.needEditTemp,
      dialogImageUrl: '',
      disabled: false,
      insertImg: []
    }
  },
  created() {
    this.whoIsChecked = this.dragResizeArr[0]
  },
  mounted() {
    const canvas = document.getElementById('rulerCanvas')

    const canvasRuler = new CanvasRuler({
      axisWidth: 0.5,
      lineColor: '#000',
      gridWidth: 100,
      gridHeight: 20
    }, canvas)

    canvasRuler.init(canvasRuler.getDrawType().ALL)
    this.$(document).ready(() => {
      this.$('#editor').resizable({
        maxWidth: 960,
        maxHeight: 830,
        minHeight: 180,
        minWidth: 260
      })
      this.$('#editor').resize((e, element) => {
        this.editorWidth = element.size.width.toString()
        this.editorHeight = element.size.height.toString()
        this.editorWidth2mm = parseInt(new UnitConversion().pxConversionMm(element.size.width))
        this.editorHeight2mm = parseInt(new UnitConversion().pxConversionMm(element.size.height))
      })
    })
    this.needEditTemp && this.handleEditTemplate(this.needEditTemp)
  },
  methods: {
    execCommand(name, args = null) {
      document.execCommand(name, false, args)
    },
    createEditDiv() {
      this.dragResizeArr.push({
        elName: 'div',
        isShow: true,
        id: new Date().getTime().toString() + this.dragResizeArr.length,
        x: 0,
        y: 0,
        width: 200,
        height: 35,
        classes: '',
        textValue: 'TEXT',
        isDragble: true,
        fontSize: '14',
        fontFamily: 'SimSun',
        fontColor: '#000',
        lineHeight: '35px',
        borderSize: 1,
        borderColor: '#333',
        isEditable: false
      })
    },
    createEditTable(row, col) {
      const trs = []
      for (let i = 0; i < row; i++) {
        trs.push([])
        for (let j = 0; j < col; j++) {
          trs[i].push('双击编辑')
        }
      }
      this.dragResizeTableArr.push({
        elName: 'table',
        isShow: true,
        id: new Date().getTime().toString() + this.dragResizeTableArr.length + '-table',
        x: 0,
        y: 0,
        width: 240,
        height: 80,
        classes: '',
        textValue: '双击编辑',
        isDragble: true,
        fontSize: '12pt',
        fontFamily: 'SimSun',
        fontColor: '#000',
        lineHeight: '35px',
        borderSize: 1,
        borderColor: '#000',
        isEditable: false,
        trs,
        row,
        col
      })
    },
    createEditDivForImg() {
      this.insertImg.push(1)
      this.dragResizeImgArr.push({
        elName: 'img',
        isShow: true,
        id: new Date().getTime().toString() + this.dragResizeImgArr.length + '-img',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        classes: '',
        isDragble: true,
        borderSize: 0,
        borderColor: 'transparent',
        isEditable: false
      })
    },
    createEditDivForQRCode() {
      this.dragResizeQRCodeArr.push({
        elName: 'QRCode',
        isShow: true,
        id: new Date().getTime().toString() + this.dragResizeQRCodeArr.length + '-QRCode',
        x: 0,
        y: 0,
        width: 100,
        height: 100,
        classes: '',
        isDragble: true,
        fontSize: '14',
        fontFamily: 'SimSun',
        fontColor: '#000',
        lineHeight: '35px',
        borderSize: 0,
        borderColor: 'transparent',
        isEditable: false
      })
    },
    selectTable(row, col) {
      this.createEditTable(row, col)
    },
    onResize(x, y, width, height) {
      this.xPx = x
      this.yPx = y
      this.widthPx = width
      this.heightPx = height
      this.x = parseInt(new UnitConversion().pxConversionMm(x))
      this.y = parseInt(new UnitConversion().pxConversionMm(y))
      this.width = parseInt(new UnitConversion().pxConversionMm(width))
      this.height = parseInt(new UnitConversion().pxConversionMm(height))
      // 如果不主动赋值，被选中的目标的x,y都是0
      this.whoIsChecked.x = x
      this.whoIsChecked.y = y
      this.whoIsChecked.width = width
      this.whoIsChecked.height = height
    },
    onDrag(x, y) {
      this.xPx = x
      this.yPx = y
      this.x = parseInt(new UnitConversion().pxConversionMm(x))
      this.y = parseInt(new UnitConversion().pxConversionMm(y))
      // 如果不主动赋值，被选中的目标的x,y都是0
      this.whoIsChecked.x = x
      this.whoIsChecked.y = y
    },
    onActivated(item, index) {
      // item.isEditable = true
      this.whoIsChecked = item
      this.whoIsCheckedIndex = index
      item.classes = 'dash-border'
      this.fontSize = item.fontSize
      this.fontValue = item.fontFamily
      this.borderSize = item.borderSize
      this.x = parseInt(new UnitConversion().pxConversionMm(this.whoIsChecked.x)) // this.whoIsChecked.x
      this.y = parseInt(new UnitConversion().pxConversionMm(this.whoIsChecked.y)) // this.whoIsChecked.y
      this.width = parseInt(new UnitConversion().pxConversionMm(this.whoIsChecked.width)) // this.whoIsChecked.width
      this.height = parseInt(new UnitConversion().pxConversionMm(this.whoIsChecked.height)) // this.whoIsChecked.height
      this.xPx = this.whoIsChecked.x
      this.yPx = this.whoIsChecked.y
      this.widthPx = this.whoIsChecked.width
      this.heightPx = this.whoIsChecked.height
    },
    onDeactivated(item) {
      item.classes = 'none-border'
      item.isDragble = true
      // item.isEditable = false
    },
    handleDbClick(item) {
      item.isDragble = false
      item.isEditable = true
    },
    handleColorChange(value) {
      this.whoIsChecked.fontColor = value
      // this.execCommand('foreColor', value)
    },
    handleFontSizeChange(value) {
      this.fontSize = value
      this.whoIsChecked.fontSize = value
    },
    handleFontFamilyChange(value) {
      this.fontValue = value
      this.whoIsChecked.fontFamily = value
    },
    handleEditorWidth(value) {
      this.editorWidth = value
    },
    handleEditorHeight(value) {
      this.editorHeight = value
    },
    handleLeft(value) {
      // this.whoIsChecked.x = parseInt(new UnitConversion().mmConversionPx(parseFloat(value)))
      this.whoIsChecked.x = parseInt(value)
    },
    handleTop(value) {
      // this.whoIsChecked.y = parseInt(new UnitConversion().mmConversionPx(parseFloat(value)))
      this.whoIsChecked.y = parseInt(value)
    },
    handleWidth(value) {
      // this.whoIsChecked.width = parseInt(new UnitConversion().mmConversionPx(parseFloat(value)))
      this.whoIsChecked.width = parseInt(value)
    },
    handleHeight(value) {
      // this.whoIsChecked.height = parseInt(new UnitConversion().mmConversionPx(parseFloat(value)))
      this.whoIsChecked.height = parseInt(value)
    },
    handleTextContentChange(value) {
      this.whoIsChecked.textValue = parseInt(value)
    },
    handleTextValue(value) {
      this.whoIsChecked.textValue = value
    },
    handleBorderSizeChange(value) {
      this.whoIsChecked.borderSize = value
    },
    handleBorderColorChange(value) {
      this.whoIsChecked.borderColor = value
    },
    rightClickHandler(type) {
      this.rightClickVisible = true
      this.whichTypeIsSelected = type
    },
    handleDeleteItem() {
      this.rightClickVisible = false
      switch (this.whichTypeIsSelected) {
        case 'text':
          this.dragResizeArr.splice(this.whoIsCheckedIndex, 1)
          break
        case 'table':
          this.dragResizeTableArr.splice(this.whoIsCheckedIndex, 1)
          break
        case 'img':
          this.dragResizeImgArr.splice(this.whoIsCheckedIndex, 1)
          this.insertImg.splice(this.whoIsCheckedIndex, 1)
          break
        case 'QRCode':
          this.dragResizeQRCodeArr.splice(this.whoIsCheckedIndex, 1)
      }
    },
    handleEditorClick() {
      this.rightClickVisible = false
    },
    preView() {
      this.dialogVisible = true
      this.$nextTick(() => {
        document.getElementById('preview').innerHTML = document.getElementById('editor').innerHTML
      })
    },
    doPrint() {
      var obj = document.getElementById('editor')
      var new_iframe = document.createElement('IFRAME')
      var doc = null
      new_iframe.setAttribute('style', 'width:0px;height:0px;position:absolute;left:-2000px;top:-2000px;')
      new_iframe.setAttribute('align', 'center')
      document.body.appendChild(new_iframe)
      doc = new_iframe.contentWindow.document
      doc.write('<div style="width:100%;height:auto;min-width:1100px;margin:0px auto;"align="center">' + obj.innerHTML + '</div>')
      doc.close()
      new_iframe.contentWindow.focus()
      new_iframe.contentWindow.print()
      // document.body.removeChild(iframe);
    },
    getTemPlates() {
      console.log('未接入接口')
    },
    handleSave() {
      this.saveVisible = true
      this.title = this.selectTemp ? this.selectTemp.templateTitle : ''
      // this.$nextTick(() => {
      //   document.getElementById('savePreview').innerHTML = document.getElementById('editor').innerHTML
      // })
    },
    handleAdd() {
      this.addVisible = true
      // this.$nextTick(() => {
      //   document.getElementById('addPreview').innerHTML = document.getElementById('editor').innerHTML
      // })
    },
    doSave() {
      this.saveVisible = false
      this.$('.handle').remove()
      this.$('.ivu-cell-group').remove()
      // console.log(document.getElementById('editor').innerHTML)
      this.$('#editor table tr td').width(this.$('#editor table tr td'))
      this.$('img').attr({
        src: '${qrcode}'
      })
      // console.log(this.$('#editor table tr td').width())
      const tempArr = this.dragResizeArr.concat(this.dragResizeTableArr, this.dragResizeArrForTime, this.dragResizeArrForVehicleNo, this.dragResizeArrForGrossWt, this.dragResizeArrForTareWt, this.dragResizeArrForNetWt, this.dragResizeArrForMaterialName, this.dragResizeQRCodeArr)
      for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i].elName === 'table') {
          const trs = []; const trsLength = document.getElementById(tempArr[i].id).firstChild.childNodes.length; const tdsLength = document.getElementById(tempArr[i].id).firstChild.childNodes[0].childNodes.length
          for (let row = 0; row < trsLength; row++) {
            trs.push([])
            for (let col = 0; col < tdsLength; col++) {
              trs[row].push(document.getElementById(tempArr[i].id).firstChild.childNodes[row].childNodes[col].innerText)
            }
          }
          this.elementArr.push({
            elName: tempArr[i].elName,
            trs,
            styles: {
              left: tempArr[i].x,
              top: tempArr[i].y,
              width: tempArr[i].width,
              height: tempArr[i].height,
              fontFamily: tempArr[i].fontFamily,
              fontSize: tempArr[i].fontSize,
              fontColor: tempArr[i].fontColor,
              borderSize: tempArr[i].borderSize,
              borderColor: tempArr[i].borderColor
            },
            id: tempArr[i].id,
            text: this.$('#' + tempArr[i].id)[0].innerText
          })
          // console.log(this.$('#' + tempArr[i].id)[0].firstChild.childNodes[0].childNodes[0].innerText)
        } else {
          this.elementArr.push({
            elName: tempArr[i].elName,
            // trs: [
            //   ['车号', '毛重', '净重'],
            //   ['${vehicleNo}', '${grossWeigh}', '${netWeigh}']
            // ],
            styles: {
              left: tempArr[i].x,
              top: tempArr[i].y,
              width: tempArr[i].width,
              height: tempArr[i].height,
              fontFamily: tempArr[i].fontFamily,
              fontSize: tempArr[i].fontSize,
              fontColor: tempArr[i].fontColor,
              borderSize: tempArr[i].borderSize,
              borderColor: tempArr[i].borderColor
            },
            id: tempArr[i].id,
            text: this.$('#' + tempArr[i].id)[0].innerText
          })
        }
      }
      // console.log(document.getElementById('editor').toString())
      changeDefaultTemp({
        templateTitle: this.selectTemp.templateTitle,
        templateId: this.selectTemp.templateId,
        templateData: `<html><body data-page-width="${document.getElementById('editor').style.width}" data-page-height="${document.getElementById('editor').style.height}">` + document.getElementById('editor').innerHTML + '</body></html>',
        templateStyle: this.elementArr,
        templateType: this.templateType
      }).then((res) => {
        this.$notify({
          message: res.desc || '保存成功',
          type: 'success',
          duration: 2000,
          position: 'bottom-right'
        })
      })
    },
    doAdd() {
      this.saveVisible = false
      this.$('.handle').remove()
      this.$('.ivu-cell-group').remove()
      // console.log(document.getElementById('editor').innerHTML)
      this.$('#editor table tr td').width(this.$('#editor table tr td'))
      this.$('img').attr({
        src: '${qrcode}'
      })
      // console.log(this.$('#editor table tr td').width())
      const tempArr = this.dragResizeArr.concat(this.dragResizeTableArr, this.dragResizeArrForTime, this.dragResizeArrForVehicleNo, this.dragResizeArrForGrossWt, this.dragResizeArrForTareWt, this.dragResizeArrForNetWt, this.dragResizeArrForMaterialName, this.dragResizeQRCodeArr)
      for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i].elName === 'table') {
          const trs = []; const trsLength = document.getElementById(tempArr[i].id).firstChild.childNodes.length; const tdsLength = document.getElementById(tempArr[i].id).firstChild.childNodes[0].childNodes.length
          for (let row = 0; row < trsLength; row++) {
            trs.push([])
            for (let col = 0; col < tdsLength; col++) {
              trs[row].push(document.getElementById(tempArr[i].id).firstChild.childNodes[row].childNodes[col].innerText)
            }
          }
          this.elementArr.push({
            elName: tempArr[i].elName,
            trs,
            styles: {
              left: tempArr[i].x,
              top: tempArr[i].y,
              width: tempArr[i].width,
              height: tempArr[i].height,
              fontFamily: tempArr[i].fontFamily,
              fontSize: tempArr[i].fontSize,
              fontColor: tempArr[i].fontColor,
              borderSize: tempArr[i].borderSize,
              borderColor: tempArr[i].borderColor
            },
            id: tempArr[i].id,
            text: this.$('#' + tempArr[i].id)[0].innerText
          })
          // console.log(this.$('#' + tempArr[i].id)[0].firstChild.childNodes[0].childNodes[0].innerText)
        } else {
          this.elementArr.push({
            elName: tempArr[i].elName,
            // trs: [
            //   ['车号', '毛重', '净重'],
            //   ['${vehicleNo}', '${grossWeigh}', '${netWeigh}']
            // ],
            styles: {
              left: tempArr[i].x,
              top: tempArr[i].y,
              width: tempArr[i].width,
              height: tempArr[i].height,
              fontFamily: tempArr[i].fontFamily,
              fontSize: tempArr[i].fontSize,
              fontColor: tempArr[i].fontColor,
              borderSize: tempArr[i].borderSize,
              borderColor: tempArr[i].borderColor
            },
            id: tempArr[i].id,
            text: this.$('#' + tempArr[i].id)[0].innerText
          })
        }
      }
      // console.log(document.getElementById('editor').toString())
      upTemplate({
        templateTitle: this.title,
        templateData: `<html><body data-page-width="${document.getElementById('editor').style.width}" data-page-height="${document.getElementById('editor').style.height}">` + document.getElementById('editor').innerHTML + '</body></html>',
        templateStyle: this.elementArr,
        templateType: this.templateType
      }).then((res) => {
        this.$notify({
          message: res.desc || '保存成功',
          type: 'success',
          duration: 2000,
          position: 'bottom-right'
        })
      })
    },
    handleSelectTemplate() {
      console.log('预览选中模板')
    },
    handleDeleteTemplate() {
      this.$confirm('确认删除?', '提示', {
        type: 'warning'
      }).then(() => {
        this.$notify({
          duration: 2000,
          type: 'success',
          message: '删除成功！',
          position: 'bottom-right'
        })
      }).catch(() => {})
    },
    handleEditTemplate(template) {
      this.selectTemp = template
      getTemplateData({
        templateTitle: template.templateTitle,
        templatePath: template.templatePath,
        templateStylePath: template.templateStylePath
      }).then((res) => {
        // const tableLength = res.data.split('<table>').filter(item => item).length
        const resArr = JSON.parse(res.data.templateStylePath)
        this.dragResizeArr = []
        this.dragResizeTableArr = []
        this.dragResizeQRCodeArr = []
        for (let i = 0; i < resArr.length; i++) {
          switch (resArr[i].elName) {
            case 'div':
              this.dragResizeArr.push({
                elName: resArr[i].elName,
                isShow: true,
                id: resArr[i].id,
                x: resArr[i].styles.left,
                y: resArr[i].styles.top,
                width: resArr[i].styles.width,
                height: resArr[i].styles.height,
                classes: '',
                textValue: resArr[i].text,
                isDragble: true,
                fontSize: resArr[i].styles.fontSize,
                fontFamily: resArr[i].styles.fontFamily,
                fontColor: resArr[i].styles.fontColor,
                lineHeight: '35px',
                borderSize: resArr[i].styles.borderSize,
                borderColor: resArr[i].styles.borderColor,
                isEditable: false
              })
              break
            case 'table':
              this.dragResizeTableArr.push({
                elName: resArr[i].elName,
                trs: resArr[i].trs,
                isShow: true,
                id: resArr[i].id,
                x: resArr[i].styles.left,
                y: resArr[i].styles.top,
                width: resArr[i].styles.width,
                height: resArr[i].styles.height,
                classes: '',
                textValue: resArr[i].text,
                isDragble: true,
                fontSize: resArr[i].styles.fontSize,
                fontFamily: resArr[i].styles.fontFamily,
                fontColor: resArr[i].styles.fontColor,
                lineHeight: '35px',
                borderSize: resArr[i].styles.borderSize,
                borderColor: resArr[i].styles.borderColor,
                isEditable: false
              })
              break
            case 'QRCode':
              this.dragResizeQRCodeArr.push({
                elName: resArr[i].elName,
                isShow: true,
                id: resArr[i].id,
                x: resArr[i].styles.left,
                y: resArr[i].styles.top,
                width: resArr[i].styles.width,
                height: resArr[i].styles.height,
                classes: '',
                isDragble: true,
                fontSize: resArr[i].styles.fontSize,
                fontFamily: resArr[i].styles.fontFamily,
                fontColor: resArr[i].styles.fontColor,
                lineHeight: '35px',
                borderSize: resArr[i].styles.borderSize,
                borderColor: resArr[i].styles.borderColor,
                isEditable: false
              })
              break
          }
        }
        this.templateVisible = false
      })
    },
    handleCurrentChange() {
      this.getTemPlates()
    },
    setDefaultTemplate(template) {
      if (this.defaultTempForCommon.templateId === template.templateId) {
        this.$notify({
          message: '已是默认模板！',
          type: 'warning',
          duration: 2000,
          position: 'bottom-right'
        })
      } else {
        changeDefaultTemp({
          isDefault: 0,
          templateId: template.templateId,
          templateType: this.activeName
        }).then((res) => {
          getDefaultTemp().then((res) => {
            res.data.common ? this.defaultTempForCommon = res.data.common : this.defaultTempForCommon = {}
            res.data.thermal ? this.defaultTempForThermal = res.data.thermal : this.defaultTempForThermal = {}
          })
          this.$notify({
            message: res.desc || '设置成功！',
            type: 'success',
            duration: 2000,
            position: 'bottom-right'
          })
        })
      }
    },
    handleSaveAsDefault() {
      this.handleSave()
    },
    handleTabClick() {
      console.log('未接入接口')
    },
    uploadImg(index) {
      var ref = 'img' + index
      console.log(ref);
      this.$refs[ref][0].dispatchEvent(new MouseEvent('click'))
    },
    getImgFile(index) {
      var that = this;
      var ref = 'img' + index
      const inputFile = this.$refs[ref][0].files[0];
      if(inputFile){
        if(inputFile.type !== 'image/jpeg' && inputFile.type !== 'image/png' && inputFile.type !== 'image/gif'){
          alert('不是有效的图片文件！');
          return;
        }
        this.imgInfo = Object.assign({}, this.imgInfo, {
          name: inputFile.name,
          size: inputFile.size,
          lastModifiedDate: inputFile.lastModifiedDate.toLocaleString()
        })
        const reader = new FileReader();
        reader.readAsDataURL(inputFile);
        reader.onload = function (e) {
          that.imgSrc = this.result;
          that.insertImg[index] = this.result
          window.focus()
        }
      } else {
        return;
      }
    }
  }
}
</script>

<style scoped>
  .el-button {
    margin-left: 0;
  }
  .el-input {
    margin-bottom: 10px;
  }
  .el-header, .el-footer {
    background-color: #B3C0D1;
    color: #333;
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
  }

  .popover-class {
    min-width: 20px;
    width: 20px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }
  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active for below version 2.1.8 */ {
    transform: translateX(10px);
    opacity: 0;
  }
  .dash-border {
    border: 1px dashed #333;
  }
  .none-border {
    border: 1px dashed transparent;
  }
  .display-none {
    display: none;
  }
</style>
