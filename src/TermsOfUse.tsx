import "./App.css";

import { Card, Container, Typography } from "@material-ui/core";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      justifyContent: "center",
    },
    card: {
      maxWidth: 800,
      padding: theme.spacing(2),
    },
  })
);

interface Props {}

export const TermsOfUse = (props: Props) => {
  const classes = useStyles(props);

  return (
    <Container className={classes.root}>
      <Card className={classes.card}>
        <Typography component="h1" variant="h4" align="center" paragraph={true}>
          利用規約
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          この利用規約（以下、「本規約」といいます。）は、このウェブサイト上で提供するサービス「Tweet
          Theater」（以下、「本サービス」といいます。）の利用条件を定めるものです。登録ユーザーの皆さま（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。
        </Typography>
        <Typography component="h2" variant="h5" paragraph={true}>
          第1条（適用）
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          本規約は、ユーザーと運営者との間の本サービスの利用に関わる一切の関係に適用されるものとします。
        </Typography>
        <Typography component="h2" variant="h5" paragraph={true}>
          第2条（利用登録）
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          本サービスにおいては、登録希望者が本規約に同意の上、Twitterにログインすることによって、利用登録が完了するものとします。
        </Typography>
        <Typography component="h2" variant="h5" paragraph={true}>
          第3条（禁止事項）
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。
          <ol>
            <li>運営者のサービスの運営を妨害するおそれのある行為</li>
            <li>不正アクセスをし、またはこれを試みる行為</li>
            <li>不正な目的を持って本サービスを利用する行為</li>
            <li>
              本サービスの他のユーザーまたはその他の第三者に不利益、損害、不快感を与える行為
            </li>
            <li>
              本サービスの内容等、本サービスに含まれる著作権、商標権ほか知的財産権を侵害する行為
            </li>
            <li>法令または公序良俗に違反する行為</li>
            <li>犯罪行為に関連する行為</li>
            <li>
              運営者のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為
            </li>
            <li>その他、運営者が不適切と判断する行為</li>
          </ol>
        </Typography>
        <Typography component="h2" variant="h5" paragraph={true}>
          第4条（本サービスの提供の停止等）
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          <ol>
            <li>
              運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。
              <ol>
                <li>
                  本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
                </li>
                <li>
                  地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合
                </li>
                <li>コンピュータまたは通信回線等が事故により停止した場合</li>
                <li>その他、運営者が本サービスの提供が困難と判断した場合</li>
              </ol>
            </li>
            <li>
              運営者は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。
            </li>
          </ol>
        </Typography>
        <Typography component="h2" variant="h5" paragraph={true}>
          第5条（利用制限および登録抹消）
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          <ol>
            <li>
              運営者は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して、本サービスの全部もしくは一部の利用を制限し、またはユーザーとしての登録を抹消することができるものとします。
              <ol>
                <li>本規約のいずれかの条項に違反した場合</li>
                <li>
                  その他、運営者が本サービスの利用を適当でないと判断した場合
                </li>
              </ol>
            </li>
            <li>
              運営者は、本条に基づき運営者が行った行為によりユーザーに生じた損害について、一切の責任を負いません。
            </li>
          </ol>
        </Typography>
        <Typography component="h2" variant="h5" paragraph={true}>
          第6条（保証の否認および免責事項）
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          <ol>
            <li>
              運営者は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。
            </li>
            <li>
              運営者は、本サービスに起因してユーザーに生じたあらゆる損害について一切の責任を負いません。
            </li>
            <li>
              前項ただし書に定める場合であっても、運営者は、運営者の過失（重過失を除きます。）による不法行為によりユーザーに生じた損害のうち特別な事情から生じた損害（運営者またはユーザーが損害発生につき予見し、または予見し得た場合を含みます。）について一切の責任を負いません。
            </li>
            <li>
              運営者は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。
            </li>
          </ol>
        </Typography>
        <Typography component="h2" variant="h5" paragraph={true}>
          第7条（サービス内容の変更等）
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          運営者は、ユーザーに通知することなく、本サービスの内容を変更しまたは本サービスの提供を中止することができるものとし、これによってユーザーに生じた損害について一切の責任を負いません。
        </Typography>
        <Typography component="h2" variant="h5" paragraph={true}>
          第8条（利用規約の変更）
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          運営者は、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。なお、本規約の変更後、本サービスの利用を開始した場合には、当該ユーザーは変更後の規約に同意したものとみなします。
        </Typography>
        <Typography component="h2" variant="h5" paragraph={true}>
          第9条（個人情報の取扱い）
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          運営者は、本サービスの利用によって取得する個人情報については、「プライバシーポリシー」に従い適切に取り扱うものとします。
        </Typography>
        <Typography component="h2" variant="h5" paragraph={true}>
          第10条（準拠法・裁判管轄）
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph={true}>
          <ol>
            <li>本規約の解釈にあたっては、日本法を準拠法とします。</li>
            <li>
              本サービスに関して紛争が生じた場合には、運営者の本店所在地を管轄する裁判所を専属的合意管轄とします。
            </li>
          </ol>
        </Typography>
        <Typography variant="body1" color="textSecondary" align="right">
          2020年8月22日 制定・施行
        </Typography>
      </Card>
    </Container>
  );
};
