import { randomUUID } from "crypto"
import readline from "readline"

type 用户id = string

class 信任管理器 {
  private 数据: { 信任者id: 用户id; 被信任者id: 用户id }[] = []

  增加信任关系(信任者: 用户id, 被信任者: 用户id): boolean {
    if (信任者 == 被信任者) return false

    const 已存在 = this.数据.some(
      (关系) => 关系.信任者id === 信任者 && 关系.被信任者id === 被信任者
    )

    if (!已存在) {
      this.数据.push({ 信任者id: 信任者, 被信任者id: 被信任者 })
      return true
    }

    return false
  }

  查询谁信任了参数(用户id: 用户id): 用户id[] {
    return this.数据
      .filter((x) => x.被信任者id == 用户id)
      .map((a) => a.信任者id)
  }
  输出信任关系(): void {
    this.数据.forEach((关系) => {
      console.log(`${关系.信任者id} 信任了 ${关系.被信任者id}`)
    })
  }
  查询参数信任了谁(用户id: 用户id): 用户id[] {
    return this.数据
      .filter((x) => x.信任者id == 用户id)
      .map((a) => a.被信任者id)
  }
}

class 用户集 {
  private 用户们: 用户[] = []

  通过id查询用户(id: 用户id): 用户 | undefined {
    return this.用户们.find((a) => a.获得id() == id)
  }
  增加用户(a: 用户) {
    this.用户们.push(a)
  }
  查看所有用户() {
    return this.用户们.map((a) => a.toString()).join("\n")
  }
}

class 用户 {
  constructor(
    private id: string,
    private 分数: number,
    private 是广告: boolean
  ) {}

  计算分数(信任管理器: 信任管理器, 用户集: 用户集): number {
    var d = 0.85
    var 信任我的人们 = 信任管理器
      .查询谁信任了参数(this.id)
      .map((a) => 用户集.通过id查询用户(a))
      .filter((a) => a != undefined)
    var 信任我的人们的TA除以LA = 信任我的人们.map((a) =>
      a.计算TA除以LA(信任管理器, 用户集)
    )
    var 后半部分 = 信任我的人们的TA除以LA.reduce((s, a) => s + a, 0)
    var 最终结果 = 1 - d + d * 后半部分

    return 最终结果
  }
  查询信任的人数(信任管理器: 信任管理器): number {
    return 信任管理器.查询参数信任了谁(this.id).length
  }
  计算TA除以LA(信任管理器: 信任管理器, 用户集: 用户集) {
    // return this.计算分数(信任管理器, 用户集) / this.查询信任的人数(信任管理器)
    return this.分数 / this.查询信任的人数(信任管理器)
  }

  获得id() {
    return this.id
  }
  获得是广告() {
    return this.是广告
  }
  toString() {
    return `用户ID: ${this.id}, 分数: ${this.分数}, 是否是广告: ${this.是广告}`
  }
}

class App {
  private 信任管理器 = new 信任管理器()
  private 用户集: 用户集 = new 用户集()

  async init() {
    const 用户列表: 用户[] = []

    for (let i = 0; i < 100; i++) {
      const 用户ID = i.toString()
      const 用户分数 = Math.random()
      const 是广告 = Math.random() < 0.1
      const 新用户 = new 用户(用户ID, 用户分数, 是广告)
      this.用户集.增加用户(新用户)
      用户列表.push(新用户)
    }

    for (const 信任者 of 用户列表) {
      for (const 被信任者 of 用户列表) {
        if (
          信任者 !== 被信任者 &&
          !信任者.获得是广告() &&
          !被信任者.获得是广告() &&
          Math.random() < 0.1
        ) {
          this.信任管理器.增加信任关系(信任者.获得id(), 被信任者.获得id())
        }
      }
    }

    // this.查看所有用户()
    // this.查看信任关系()

    var 用户0 = 用户列表[0]!

    // 输出
    console.log(
      "用户0的分数: %O",
      用户0.计算分数(this.信任管理器, this.用户集)
    )
    console.log(
      "信任了用户0的用户ID列表: %O",
      this.信任管理器.查询谁信任了参数(用户0.获得id())
    )

    var x = false
    while (x == false) {
      x = this.信任管理器.增加信任关系(
        用户列表
          .sort((a, b) => Math.random() - 0.5)
          .find((a) => a.获得是广告() == false)!
          .获得id(),
        用户0.获得id()
      )
    }

    // 输出
    console.log(
      "用户0的分数: %O",
      用户0.计算分数(this.信任管理器, this.用户集)
    )
    console.log(
      "信任了用户0的用户ID列表: %O",
      this.信任管理器.查询谁信任了参数(用户0.获得id())
    )
  }

  async 手动添加用户(
    用户分数: number = 0.5,
    是广告: boolean = false,
    用户ID?: string
  ) {
    const 新用户 = new 用户(用户ID || randomUUID(), 用户分数, 是广告)
    this.用户集.增加用户(新用户)
    console.log("用户添加成功:", 新用户.toString())
  }

  获取输入(提示: string): Promise<string> {
    return new Promise((resolve) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      rl.question(提示, (输入: string) => {
        rl.close()
        resolve(输入)
      })
    })
  }

  查看所有用户() {
    const 用户们 = this.用户集.查看所有用户()
    console.log(用户们)
  }
  查看信任关系() {
    this.信任管理器.输出信任关系()
  }
}

new App().init().catch(console.error)
