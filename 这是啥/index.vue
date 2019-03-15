<template>
    <div class="calculate_box">
        <el-dialog width="1200px" :visible.sync="calculateShow">
            <div class="title_hd">
                <div class="hd">
                    <span>我家装修需要多少钱？</span>
                </div>
                <p class="tag">
                    <img src="~/assets/img/Calculator/FClogo.png"> 蜂巢SAAS技术支持
                </p>
                <a href="javascript:;" class="close_btn" @click="handleCloses">
                    <i class="iconfont iconcuowu"></i>
                </a>
            </div>
            <div class="content_">
                <!-- 左边模块 -->
                <div class="content_left">
                    <div class="contenet_title">
                        <div class="note_"></div>
                        <div class="note_hd">个性化定制</div>
                    </div>
                    <div class="content_tag">
                        <div class="tag_logo tag_left" @click="pichide(n,s)" :class="{log_bg:n.show_}"
                             v-for="(n,s) in pic_data" :key="s">
                            <div class="logo_">
                                <img v-show="n.show_" :src="n.imgpath2">
                                <img v-show="n.shows" :src="n.imgpath">
                            </div>
                            <p class="logo_font">{{n.name}}</p>
                            <p class="logo_font">{{n.count}}</p>
                        </div>
                    </div>
                </div>
                <div class="content_custom">
                    <div class="custom_hd">
                        <div v-for="(n,s) in pic_data" :key="s"><span v-if="n.show_"
                                                                      class="custom_con">{{n.name}}:</span></div>
                        <div class='' style="display:inline-block"><span
                                v-for="(item,index) in pic_data[subindex].CustomData" :key="index"><div v-if="item.show"
                                                                                                        class="custom_id"><span
                                class="bd">{{item.name}}</span> <i class="id_close iconfont iconcuowu"
                                                                   @click="item.show=false"></i></div></span></div>
                        <span class="custom_count">(0/5)</span>
                    </div>
                    <div class="custom_">
                        <div class="custom_assem" v-for="(item,index) in pic_data[subindex].CustomData" :key="item.id" :class="{active:item.show}">
                            <div class="item_input">
                                <el-checkbox v-model="item.show"></el-checkbox>
                            </div>
                            <div class="item_p" @click="handleActive(item,index)">
                                <!-- <div class="cunstom_option"> -->
                                <p class="option_title">{{item.name}}</p>
                                <p class="option_content text-overflow">{{item.content}}</p>
                                <!-- </div> -->
                            </div>
                        </div>

                    </div>
                </div>
                <!-- 右边计算模块 -->
                <div class="content_right">
                    <div class="contenet_title2">
                        <div class="note_2"></div>
                        <div class="note_hd2">预算总金额</div>
                    </div>
                    <!-- 图表 -->
                    <div class="Chart">
                        <div class="Echarts">
                            <div class="Ring">
                                <div class="money_">
                                    <p>￥</p>
                                    <p>????.00</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 价格表 -->
                    <div class="money_list">
                        <div class="list_title">
                            <ul>
                                <li><span><i class="iconfont iconarea">80㎡</i></span></li>
                                <li><i class="iconfont iconhuxing_">2室1厅1卫</i></li>
                                <li><i class="iconfont iconfengge"> 经济实用</i></li>
                                <li><i class="iconfont iconceliang">简洁时尚</i></li>
                            </ul>
                        </div>
                        <div class="list_assem">
                            <ul>
                                <li>
                                    <div class="list_spot"></div>
                                    <div class="list_font">客厅</div>
                                    <el-popover placement="right" width="230" trigger="hover" class="list_pop">
                                        <ul v-for="item in tag_data" :key="item">
                                            <li style="border-bottom: 1px solid #f1f1f1;height:40px;line-height:40px;">
                                                <div class="tag_name"
                                                     style="font_size:12px;color:#999999;float:left;margin-right:16px;">
                                                    {{item.name}}
                                                </div>
                                                <div class="tag_price"
                                                     style="font_size:12px;color:#999999;float:right;">{{item.price}}
                                                </div>
                                            </li>
                                        </ul>
                                        <el-button slot="reference" size="small" native-type="buttton" type="text"><i
                                                class="iconfont iconGroup tips_"></i></el-button>
                                    </el-popover>

                                    <div class="price" v-bind="price">{{price}}</div>
                                </li>
                                <li>
                                    <div class="list_spot"></div>
                                    <div class="list_font">餐厅</div>
                                    <el-popover placement="right" width="230" trigger="hover">
                                        <ul v-for="item in tag_data" :key="item">
                                            <li style="border-bottom: 1px solid #f1f1f1;height:40px;line-height:40px;">
                                                <div class="tag_name"
                                                     style="font_size:12px;color:#999999;float:left;margin-right:16px;">
                                                    {{item.name}}
                                                </div>
                                                <div class="tag_price"
                                                     style="font_size:12px;color:#999999;float:right;">{{item.price}}
                                                </div>
                                            </li>
                                        </ul>
                                        <el-button slot="reference" size="small" native-type="buttton" type="text"><i
                                                class="iconfont iconGroup tips_"></i></el-button>
                                    </el-popover>
                                    <div class="price" v-bind="price">{{price}}</div>
                                </li>
                                <li>
                                    <div class="list_spot"></div>
                                    <div class="list_font">主卧</div>
                                    <el-popover placement="right" width="230" trigger="hover">
                                        <ul v-for="item in tag_data" :key="item">
                                            <li style="border-bottom: 1px solid #f1f1f1;height:40px;line-height:40px;">
                                                <div class="tag_name"
                                                     style="font_size:12px;color:#999999;float:left;margin-right:16px;">
                                                    {{item.name}}
                                                </div>
                                                <div class="tag_price"
                                                     style="font_size:12px;color:#999999;float:right;">{{item.price}}
                                                </div>
                                            </li>
                                        </ul>
                                        <el-button slot="reference" size="small" native-type="buttton" type="text"><i
                                                class="iconfont iconGroup tips_"></i></el-button>
                                    </el-popover>
                                    <div class="price" v-bind="price">{{price}}</div>
                                </li>
                                <li>
                                    <div class="list_spot"></div>
                                    <div class="list_font">次卧</div>
                                    <el-popover placement="right" width="230" trigger="hover">
                                        <ul v-for="item in tag_data" :key="item">
                                            <li style="border-bottom: 1px solid #f1f1f1;height:40px;line-height:40px;">
                                                <div class="tag_name"
                                                     style="font_size:12px;color:#999999;float:left;margin-right:16px;">
                                                    {{item.name}}
                                                </div>
                                                <div class="tag_price"
                                                     style="font_size:12px;color:#999999;float:right;">{{item.price}}
                                                </div>
                                            </li>
                                        </ul>
                                        <el-button slot="reference" size="small" native-type="buttton" type="text"><i
                                                class="iconfont iconGroup tips_"></i></el-button>
                                    </el-popover>
                                    <div class="price" v-bind="price">{{price}}</div>
                                </li>
                                <li>
                                    <div class="list_spot"></div>
                                    <div class="list_font">厨房</div>
                                    <el-popover placement="right" width="230" trigger="hover">
                                        <ul v-for="item in tag_data" :key="item">
                                            <li style="border-bottom: 1px solid #f1f1f1;height:40px;line-height:40px;">
                                                <div class="tag_name"
                                                     style="font_size:12px;color:#999999;float:left;margin-right:16px;">
                                                    {{item.name}}
                                                </div>
                                                <div class="tag_price"
                                                     style="font_size:12px;color:#999999;float:right;">{{item.price}}
                                                </div>
                                            </li>
                                        </ul>
                                        <el-button slot="reference" size="small" native-type="buttton" type="text"><i
                                                class="iconfont iconGroup tips_"></i></el-button>
                                    </el-popover>
                                    <div class="price" v-bind="price">{{price}}</div>
                                </li>
                                <li>
                                    <div class="list_spot"></div>
                                    <div class="list_font">主卫</div>
                                    <el-popover placement="right" width="230" trigger="hover">
                                        <ul v-for="item in tag_data" :key="item">
                                            <li style="border-bottom: 1px solid #f1f1f1;height:40px;line-height:40px;">
                                                <div class="tag_name"
                                                     style="font_size:12px;color:#999999;float:left;margin-right:16px;">
                                                    {{item.name}}
                                                </div>
                                                <div class="tag_price"
                                                     style="font_size:12px;color:#999999;float:right;">{{item.price}}
                                                </div>
                                            </li>
                                        </ul>
                                        <el-button slot="reference" size="small" native-type="buttton" type="text"><i
                                                class="iconfont iconGroup tips_"></i></el-button>
                                    </el-popover>
                                    <div class="price" v-bind="price">{{price}}</div>
                                </li>
                                <li>
                                    <div class="list_spot"></div>
                                    <div class="list_font">阳台</div>
                                    <el-popover placement="right" width="230" trigger="hover">
                                        <ul v-for="item in tag_data" :key="item">
                                            <li style="border-bottom: 1px solid #f1f1f1;height:40px;line-height:40px;">
                                                <div class="tag_name"
                                                     style="font_size:12px;color:#999999;float:left;margin-right:16px;">
                                                    {{item.name}}
                                                </div>
                                                <div class="tag_price"
                                                     style="font_size:12px;color:#999999;float:right;">{{item.price}}
                                                </div>
                                            </li>
                                        </ul>
                                        <el-button slot="reference" size="small" native-type="buttton" type="text"><i
                                                class="iconfont iconGroup tips_"></i></el-button>
                                    </el-popover>
                                    <div class="price" v-bind="price">{{price}}</div>
                                </li>
                                <li>
                                    <div class="list_spot"></div>
                                    <div class="list_font">杂项</div>
                                    <el-popover placement="right" width="230" trigger="hover">
                                        <ul v-for="item in tag_data" :key="item">
                                            <li style="border-bottom: 1px solid #f1f1f1;height:40px;line-height:40px;">
                                                <div class="tag_name"
                                                     style="font_size:12px;color:#999999;float:left;margin-right:16px;">
                                                    {{item.name}}
                                                </div>
                                                <div class="tag_price"
                                                     style="font_size:12px;color:#999999;float:right;">{{item.price}}
                                                </div>
                                            </li>
                                        </ul>
                                        <el-button slot="reference" size="small" native-type="buttton" type="text"><i
                                                class="iconfont iconGroup tips_"></i></el-button>
                                    </el-popover>
                                    <div class="price" v-bind="price">{{price}}</div>
                                </li>
                                <li>
                                    <div class="list_spot"></div>
                                    <div class="list_font">空调地暖</div>
                                    <el-popover placement="right" width="230" trigger="hover">
                                        <ul v-for="item in tag_data" :key="item">
                                            <li style="border-bottom: 1px solid #f1f1f1;height:40px;line-height:40px;">
                                                <div class="tag_name"
                                                     style="font_size:12px;color:#999999;float:left;margin-right:16px;">
                                                    {{item.name}}
                                                </div>
                                                <div class="tag_price"
                                                     style="font_size:12px;color:#999999;float:right;">{{item.price}}
                                                </div>
                                            </li>
                                        </ul>
                                        <el-button slot="reference" size="small" native-type="buttton" type="text"><i
                                                class="iconfont iconGroup tips_"></i></el-button>
                                    </el-popover>
                                    <div class="price" v-bind="price">{{price}}</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <!-- 预算进度条 -->
                    <div class="budget">
                        <div class="budget_title">
                            <p>当前预算准确度</p>
                        </div>
                        <div class="budget_progress">
                            <el-progress :percentage="45" :stroke-width="13" color="#e5c88d"></el-progress>
                        </div>
                        <button class="budget_send">将报价清单发送至手机</button>
                        <div class="artificial">
                            人工精准报价
                        </div>
                    </div>
                </div>
                <!-- 重新计算按钮 -->
                <div class="Recalculation">
                    <button class="Recalculation_ntn">重新<br>计算</button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {

        props: ["calculateShow"],
        data() {
            return {
                price: "￥1234",
                hide: true,
                subindex: 0,
                pic_data: [
                    {
                        name: "客厅",
                        show_: true,
                        shows: false,
                        imgpath: require('@/static/img/Calculator/livingroom.png'),
                        imgpath2: require('@/static/img/Calculator/l.png'),
                        count: "(0/5)",
                        CustomData: [
                            {
                                name: "背景墙",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "顶面造型",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "定制衣柜",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            }
                        ]

                    },
                    {
                        name: "餐厅",
                        show_: false,
                        shows: true,
                        imgpath: require('@/static/img/Calculator/restaurant.png'),
                        imgpath2: require('@/static/img/Calculator/r.png'),
                        count: "(0/5)",
                        CustomData: [
                            {
                                name: "背景墙",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "顶面造型",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "定制衣柜",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            }
                        ]

                    },
                    {
                        name: "主卧",
                        show_: false,
                        shows: true,
                        imgpath: require('@/static/img/Calculator/room.png'),
                        imgpath2: require('@/static/img/Calculator/rooms.png'),
                        count: "(0/5)",
                        CustomData: [
                            {
                                name: "背景墙",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "顶面造型",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "定制衣柜",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            }
                        ]
                    },
                    {
                        name: "次卧",
                        show_: false,
                        shows: true,
                        imgpath: require('@/static/img/Calculator/room2.png'),
                        imgpath2: require('@/static/img/Calculator/rooms.png'),
                        count: "(0/5)",
                        CustomData: [
                            {
                                name: "背景墙",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "顶面造型",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "定制衣柜",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            }
                        ]
                    },
                    {
                        name: "厨房",
                        show_: false,
                        shows: true,
                        imgpath: require('@/static/img/Calculator/kitchen.png'),
                        imgpath2: require('@/static/img/Calculator/k.png'),
                        count: "(0/5)",
                        CustomData: [
                            {
                                name: "背景墙",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "顶面造型",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "定制衣柜",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            }
                        ]
                    },
                    {
                        name: "主卫",
                        show_: false,
                        shows: true,
                        imgpath: require('@/static/img/Calculator/toilet.png'),
                        imgpath2: require('@/static/img/Calculator/t.png'),
                        count: "(0/5)",
                        CustomData: [
                            {
                                name: "背景墙",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "顶面造型",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "定制衣柜",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            }
                        ]
                    },
                    {
                        name: "阳台",
                        show_: false,
                        shows: true,
                        imgpath: require('@/static/img/Calculator/balcony.png'),
                        imgpath2: require('@/static/img/Calculator/f.png'),
                        count: "(0/5)",
                        CustomData: [
                            {
                                name: "背景墙",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "顶面造型",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "定制衣柜",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            }
                        ]
                    },
                    {
                        name: "杂项",
                        show_: false,
                        shows: true,
                        imgpath: require('@/static/img/Calculator/hovel.png'),
                        imgpath2: require('@/static/img/Calculator/b.png'),
                        count: "(0/5)",
                        CustomData: [
                            {
                                name: "背景墙",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "顶面造型",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "定制衣柜",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            }
                        ]
                    },
                    {
                        name: "餐厅",
                        show_: false,
                        shows: true,
                        imgpath: require('@/static/img/Calculator/airconditioner.png'),
                        imgpath2: require('@/static/img/Calculator/a.png'),
                        count: "(0/5)",
                        CustomData: [
                            {
                                name: "背景墙",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "顶面造型",
                                show: false,
                                content: "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "定制衣柜",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            },
                            {
                                name: "地面材质提升",
                                show: false,
                                content:
                                    "运用石材、软包、砖上墙等，昂贵 装饰材料，达到提升皮质的作用。"
                            }
                        ]
                    },
                ],
                tag_data: [
                    {
                        name: "主卧室背景墙",
                        price: "￥31200"
                    },
                    {
                        name: "地面提升材质",
                        price: "￥31200"
                    },
                    {
                        name: "墙面提升材质",
                        price: "￥31200"
                    },
                    {
                        name: "顶面造型",
                        price: "￥31200"
                    },
                    {
                        name: "定制衣柜",
                        price: "￥31200"
                    }
                ],

                checked: false

            };
        },
        methods: {
            handleClose() {
            },
            handleCloses() {
                this.$emit("hidePanel")
            },
            handleActive(item, index) {
                item.show = !item.show;
            },
            pichide(n, s) {
                n.show_ = !n.show_;
                n.shows = !n.shows;
                this.subindex = s;

            }

        }
    }
</script>
<style lang="less" scoped>
    @import "~@/assets/css/common/_mixins.less";

    .calculate_box {
        .title_hd {
            position: relative;
            height: auto;
            background: url("../../assets/img/Calculator/bg.png") no-repeat top;
            padding: 0 40px;

            .hd {
                display: inline-block;
                position: relative;
                padding: 0 10px;
                margin-top: 30px;
                font-size: 30px;
                font-weight: bold;
                color: #fff;
                line-height: 1;

                span {
                    position: relative;
                    display: inline-block;
                    z-index: 9;
                }

                &:after {
                    content: "";
                    position: absolute;
                    left: 0;
                    bottom: -2px;
                    width: 100%;
                    height: 11px;
                    background-color: #416697;
                    z-index: 1;
                }
            }

            .tag {
                position: absolute;
                bottom: 15px;
                right: 40px;
                font-size: 10px;
                color: #fff;
                opacity: 0.5;
            }

            .close_btn {
                position: absolute;
                right: -13px;
                top: -13px;
                display: inline-block;
                width: 46px;
                height: 46px;
                line-height: 46px;
                background-color: #fff;
                text-align: center;
                border-radius: 50%;
                color: #000;

                .iconfont {
                    font-size: 30px;
                }
            }
        }

        .content_ {
            position: relative;
            top: -6px;
            min-height: 734px;
            border-radius: 8px;
            width: 1200px;
            background-color: #fff;
            overflow: hidden;

            .contenet_title {
                height: 68px;
                position: relative;
                left: 40px;
                line-height: 40px;

                .note_ {
                    width: 12px;
                    height: 12px;
                    background-color: #15524d;
                    position: absolute;
                    top: 35px;
                }

                .note_hd {
                    font-size: 14px;
                    color: #999999;
                    position: absolute;
                    top: 21px;
                    left: 23px;
                }
            }

            .content_tag {
                height: 188px;
                width: 580px;
                margin-left: 40px;

                .tag_logo {
                    float: left;
                    width: 77px;
                    height: 95px;
                    border-top: 1px solid rgba(153, 153, 153, 0.5);
                    border-right: 1px solid rgba(153, 153, 153, 0.5);
                    border-bottom: 1px solid rgba(153, 153, 153, 0.5);
                    text-align: center;
                    cursor: pointer;

                    .logo_ {
                        height: 50px;
                        line-height: 50px;
                    }

                    .logo_font {
                        font-size: 12px;
                        color: rgba(153, 153, 153, 0.5);
                    }
                }

                .log_bg {
                    background-color: #f1f1f1;
                }

                .tag_left {
                    border-left: 1px solid rgba(153, 153, 153, 0.5);
                }

                .tag_top {
                    border-top: none;
                }

                .isActive {
                    background-color: #f1f1f1;
                }
            }

            .content_custom {
                .custom_hd {
                    width: 535px;
                    height: 45px;
                    background-color: #f1f1f1;
                    margin-top: 15px;
                    margin-left: 40px;
                    line-height: 45px;
                    position: relative;

                    .custom_con {
                        margin-left: 15px;
                        font-size: 14px;
                        color: #000;
                        float: left;
                    }

                    .custom_count {
                        color: #bcbcbc;
                        font-size: 14px;
                        position: absolute;
                        right: 15px;
                    }

                    .custom_id {
                        float: left;
                        width: auto;
                        display: inline-block;
                        height: 30px;
                        color: #000000;
                        font-size: 14px;
                        background-color: #ffffff;
                        margin-left: 13px;
                        margin-top: 9px;
                        line-height: 30px;
                        text-align: center;
                        position: relative;
                        cursor: pointer;

                        .id_close {
                            margin-top: -10px;
                            font-size: 8px;
                            float: right;
                            margin-right: 2px;
                            color: #cccccc;
                            cursor: pointer;
                        }

                        .bd {
                            margin-left: 10px;
                            margin-right: 5px;
                        }

                    }
                }

                .custom_ {
                    width: 535px;
                    background-color: #fafafa;
                    height: 380px;
                    margin-left: 40px;
                    .clearfix();

                    .custom_assem {
                        position: relative;
                        width: 234px;
                        height: 100px;
                        margin-left: 24px;
                        margin-top: 20px;
                        background-color: #fff;
                        border: 1px solid #eaeaea;
                        cursor: pointer;
                        .fl();

                        .item_input {
                            position: absolute;
                            left: -14px;
                            top: -9px;
                        }

                        .item_p {
                            width: 234px;
                            height: 100px;

                            .option_title {
                                font-size: 12px;
                                color: #000000;
                                margin-top: 20px;
                                margin-left: 10px;
                            }

                            .option_content {
                                font-size: 12px;
                                color: #dbd5c9;
                                margin-top: 10px;
                                margin-left: 10px;
                            }
                        }
                    }

                    .active {
                        background-color: #faf4e6;
                        border: 1px solid #e5c88d;
                    }
                }
            }
        }

        .content_right {
            position: absolute;
            top: 0px;
            left: 666px;
            width: 535px;
            border-left: 1px solid #e5c88d;
            height: 800px;

            .contenet_title2 {
                height: 68px;
                position: relative;
                left: 40px;
                line-height: 40px;

                .note_2 {
                    width: 12px;
                    height: 12px;
                    background-color: #15524d;
                    position: absolute;
                    top: 35px;
                }

                .note_hd2 {
                    font-size: 14px;
                    color: #999999;
                    position: relative;
                    top: 21px;
                    left: 23px;
                }
            }

            .Chart {
                width: 535px;

                .Echarts {
                    width: 160px;
                    height: 160px;
                    border-radius: 50%;
                    background-color: #15524d;
                    margin: 0 auto;
                    text-align: center;
                    position: relative;

                    .Ring {
                        width: 135px;
                        height: 135px;
                        border-radius: 50%;
                        background-color: #ffffff;
                        position: relative;
                        top: 13px;
                        left: 13px;
                        text-align: center;

                        .money_ {
                            text-align: center;
                            font-size: 24px;
                            color: #e5c88d;
                            font-weight: bold;
                            padding-top: 25px;
                        }
                    }
                }
            }

            .money_list {
                .list_title {
                    margin-left: 88px;
                    margin-top: 20px;

                    ul > li {
                        float: left;
                        color: #999999;
                        border-right: 1px solid #f1f1f1;

                        i {
                            margin-left: 15px;
                            margin-right: 25px;
                            font-size: 12px;
                        }
                    }

                    ul > li:last-child {
                        border: none;
                    }
                }

                .list_assem {
                    margin-top: 8px;
                    margin-left: 88px;

                    ul > li {
                        clear: both;
                        width: 387px;
                        height: 36px;
                        border: 1px solid #f1f1f1;
                        border-bottom: none;
                        line-height: 36px;

                        .list_spot {
                            width: 5px;
                            height: 5px;
                            border-radius: 50%;
                            background-color: #000;
                            float: left;
                            margin-top: 16px;
                            margin-left: 10px;
                        }

                        .list_font {
                            float: left;
                            color: #000;
                            font-size: 12px;
                            margin-left: 10px;
                        }

                        .price {
                            color: #fe615a;
                            font-size: 12px;
                            font-weight: bold;
                            float: right;
                            margin-right: 18px;
                        }

                        .el-button {
                            background-color: none;
                            top: 0px;
                            border: none;
                            margin-left: 5px;

                            .tips_ {
                                width: 10px;
                                height: 12px;
                                color: #e3e1e1;

                            }

                        }

                    }

                    ul > li:last-child {
                        border-bottom: 1px solid #f1f1f1;
                    }

                }
            }

            .budget {
                width: 535px;
                margin-left: 88px;
                margin-top: 5px;

                .budget_title {
                    text-align: left;

                    p {
                        color: #999999;
                        font-size: 12px;
                    }
                }

                .budget_progress {
                    width: 400px;
                    margin-top: 10px;
                }

                .budget_send {
                    background-color: #15524d;
                    width: 204px;
                    height: 50px;
                    border-radius: 4px;
                    color: #ffffff;
                    font-size: 14px;
                    margin-top: 18px;
                    cursor: pointer;
                }

                .artificial {
                    text-decoration: underline;
                    color: #656565;
                    font-size: 12px;
                    position: relative;
                    top: -35px;
                    left: 235px;
                    cursor: pointer;
                }

            }
        }

        .Recalculation {
            width: 96.99px;
            height: auto;
            position: relative;
            top: -300px;
            left: 620px;
            cursor: pointer;

            .Recalculation_ntn {
                background-color: #e5c88d;
                width: 97px;
                height: 97px;
                border-radius: 50%;
                font-size: 18px;
                color: #000000;
                box-shadow: 0 0 0 18px #f2e3c6;
                cursor: pointer;
            }
        }
    }
</style>
