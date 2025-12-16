import { StyleSheet, Text, View, SafeAreaView, ScrollView } from "react-native";
import React from "react";
import Header from "./Header/Header";
import { useTheme } from "../theme/ThemeContext";
import { universityName } from "./constants";

const TermsScreen = ({ navigation }) => {
  const { isDark, colors, toggleTheme } = useTheme();
  const styles = createStyles(colors);
  return (
    <SafeAreaView style={styles.container}>
      <Header title="Terms" navigation={navigation} />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Terms of Service Overview</Text>
        <Text style={styles.text}>
          Below is an overview of our Terms of Service for our “Platform”, which
          means any website, application, or service we offer. You should read
          the complete Terms of Service because that document (and not this
          overview) is our legally binding agreement. The Terms of Service
          includes information about your legal rights and covers areas such as
          automatic subscription renewals, limitations of liability, resolution
          of disputes by mandatory arbitration rather than a judge or jury in a
          court of law, and a class action waiver.
        </Text>
        <Text style={styles.subtitle}>
          Your Relationship with {universityName}
        </Text>
        <Text style={styles.text}>
          1. By using our Platform, you are agreeing to our Terms of Service.
          That is a legally binding agreement between you and {universityName}.
        </Text>
        <Text style={styles.text}>
          2. If you break the rules, we may suspend or terminate your account.
        </Text>
        <Text style={styles.text}>
          3. We charge for certain aspects of our Platform, and some of these
          fees are billed on a regular and recurring basis (unless you disable
          auto-renewal or cancel your subscription).
        </Text>
        <Text style={styles.subtitle}>
          {universityName} Groups, Organizers and Members
        </Text>
        <Text style={styles.text}>
          1. Organizers may establishmembership criteriafor their own{" "}
          {universityName} groups. Whilethere is probably a {universityName}{" "}
          group out there for everyone, not every {universityName} group is for
          you. If you can’t find the right group, you can easily start your own
          {universityName} group.
        </Text>
        <Text style={styles.text}>
          2. Organizers may charge fees for memberships or events.
        </Text>
        <Text style={styles.text}>
          3. Using our Platform involves meeting real people and doing real
          things in the real world, which can sometimes lead to unexpected
          situations. We can’t control what happens in the real world, andwe are
          not responsible for it. You should use common sense and good judgment
          when interacting with others.
        </Text>
        <Text style={styles.subtitle}>Your Content and Content of Others</Text>
        <Text style={styles.text}>
          1. You are responsible for your “Content”, which means any
          information, material, or other content posted to our Platform. Your
          Content must comply with our Terms of Service, which includes theUsage
          and Content Policies, Group Policies, Member Restrictions, Payment
          Policies etc. Your Content is also subject to our Intellectual
          Property Dispute Policies.
        </Text>
        <Text style={styles.text}>
          2. We do not own the Content that you post. However, we do require
          thatyou provide us a license to use this Content for us to operate,
          improve, promote, and protect {universityName} and our Platform for
          the benefit of you and others.
        </Text>
        <Text style={styles.text}>
          3. We are not responsible for Content that members post or the
          communications that members send using our Platform.
        </Text>
        <Text style={styles.text}>
          4. We generally don’t review Content before it’s posted. If you see
          Content that violates our Terms of Service, you may report
          inappropriate Content to us.
        </Text>
        <Text style={styles.subtitle}>Our Platform</Text>
        <Text style={styles.text}>
          1. We try hard to make sure that our Platform is always available and
          working, but we cannot guarantee it will be. Occasionally things may
          not go exactly as planned. We apologize in advance for any
          inconvenience.
        </Text>
        <Text style={styles.text}>
          2. We are continually improving our Platform. This means that we may
          modify or discontinue portions of our Platform.
        </Text>
        <Text style={styles.text}>
          3. By using our Platform, you agree to the limitations of liability
          and release in our Terms of Service. Except as specified in our Terms
          of Service, you also agree to resolve any disputes you may have with
          us through arbitration, and you are waiving your right to seek relief
          from a judge or jury in a court of law, except as otherwise provided
          for in the Terms of Service. Claims can only be brought individually,
          and not as part of a class action.
        </Text>
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.subtitle}>1. The Agreement</Text>
        <Text style={styles.text}>
          {universityName} enables you and other members to arrange off-line,
          real-world {universityName} groups and {universityName} events. The
          terms “{universityName},” “we,” “us,” and “our” include{" "}
          {universityName}, Inc. and our affiliates. We use the terms “you” and
          “your” to mean any person using our Platform, and any organization or
          person using the Platform on an organization’s behalf. We use the word
          “Platform” to mean any website, application, or service offered by{" "}
          {universityName}, including content we offer and electronic
          communications we send. We provide our Platform to you subject to
          these Terms of Service.{"\n"} We use the terms “Terms of Service” and
          “Agreement” interchangeably to mean this document together with our
          Usage and Content Policies, Group Policies etc. Your use of the
          Platform signifies that you agree to this Agreement. {"\n"}If you are
          using the Platform for an organization, you agree to this Agreement on
          behalf of that organization, and represent you have authority to bind
          that organization to the terms contained in this Agreement. If you do
          not or are unable to agree to this Agreement, do not use our Platform.
        </Text>
        <Text style={styles.subtitle}>1.1 Revisions to this Agreement</Text>
        <Text style={styles.text}>
          We may modify this Agreement from time to time. When we do, we will
          provide notice to you by publishing the most current version and
          revising the date at the top of this page. If we make any material
          change to this Agreement, we will provide additional notice to you,
          such as by sending you an email or displaying a prominent notice on
          our Platform. By continuing to use the Platform after any changes come
          into effect, you agree to the revised Agreement.
        </Text>
        <Text style={styles.subtitle}>2. Your Account and Membership</Text>
        <Text style={styles.text}>
          2.1 Eligibility-: Our Platform is available to anyone who is at least
          18 years old. You represent that you are at least 18. Additional
          eligibility requirements for a portion of our Platform may be set by
          any member who can moderate or manage that portion of our Platform.
          For example, the eligibility requirements for a {universityName} group
          or
          {universityName} event may be set by the organizers of that group.
        </Text>
        <Text style={styles.text}>
          2.2 Suspension of Your Account-:We may modify, suspend or terminate
          your account or access to the Platform if, in our sole discretion, we
          determine that you have violated this Agreement, including any of the
          policies or guidelines that are part of this Agreement, that it is in
          the best interest of the {universityName} community, or to protect our
          brand or Platform. We also may remove accounts of members who are
          inactive for an extended period.{"\n"} A member who can moderate or
          manage a portion of our Platform also has the ability, in his or her
          sole discretion, to modify, suspend, or terminate your access to that
          portion of the Platform.
        </Text>
        <Text style={styles.text}>
          2.3 Account Information and Security -: When you register, you provide
          us with some basic information, including an email address and a
          password. Keep your email address and other account information
          current and accurate. Also, you agree to maintain the security and
          confidentiality of your password (or else we may need to disable your
          account).{"\n"} You alone are responsible for anything that happens
          from your failure to maintain that security and confidentiality, such
          as by sharing your account credentials with others. If someone is
          using your password, notify us immediately.
        </Text>
        <Text style={styles.subtitle}>3. Fees, Payments and Offers</Text>
        <Text style={styles.text}>
          3.1Fees Charged by {universityName} -: Use of some of the features on
          our Platform is free, and we charge fees for other features. We may in
          the future implement a new fee, or modify an existing fee, for certain
          current or future features of our Platform. If we implement a new or
          modified fee, we will give you advanced notice such as by posting
          changes on our Platform or sending you an email.{"\n"}
          You agree to pay those fees and any associated taxes for your
          continued use of the applicable service. Unless otherwise stated, all
          fees and all transactions are in U.S. dollars. All fees are exclusive
          of applicable federal, state, local, or other taxes. Organizer
          subscriptions are non-transferable.
        </Text>
        <Text style={styles.subtitle}>4. Your Content and Privacy</Text>
        <Text style={styles.text}>
          4.1 Your Content -: You are solely responsible for your Content. We
          use the word “Content” to mean any information, material, or other
          content posted to our Platform or otherwise provide to us (such as
          feedback, comments, or suggestions shared with us). You agree that you
          and your Content shall not violate the rights of any third party (such
          as copyrights, trademarks, contract rights, privacy rights, or
          publicity rights),{"\n"}
          this Agreement (including ourUsage and Content Policies, Group
          Policies, , Member Restrictions, and Intellectual Property Policies)
        </Text>
        <Text style={styles.text}>
          4.2 Content License from You -: We do not claim ownership of your
          Content. However, to enable us to operate, improve, promote, and
          protect {universityName} and our Platform, and to ensure we do not
          violate any rights you may have in your Content, you hereby grant{" "}
          {universityName} a non-exclusive, worldwide, perpetual, irrevocable,
          royalty-free, sublicensable, transferable right and license (including
          a waiver of any moral rights) to use, host, store, reproduce, modify,
          publish, publicly display, publicly perform, distribute, and create
          derivative works of, your Content and to commercialize and exploit the
          copyright, trademark, publicity, and database rights you have in your
          Content.
        </Text>
        <Text style={styles.text}>
          4.3 Privacy-: {universityName} collects registration and other
          information about you through our Platform. Please refer to our
          Privacy Policy and Cookie Policy for details on how we collect, use,
          and disclose this information. These policies do not govern use of
          information that you provide to third parties, such as other members
          of {universityName}’s Platform.
        </Text>
        <Text style={styles.subtitle}>5. Your Use of Our Platform</Text>
        <Text style={styles.text}>
          5.1 Our Policies, Guidelines and Applicable Laws -: When you use our
          Platform, we require that you follow the Usage and Content Policies,
          Member Restrictions, Payment Policies etc. You also agree to comply
          with all applicable laws, rules and regulations, and to not violate or
          infringe the rights of any third party. If you do not comply, we may
          modify, suspend or terminate your account or access to the Platform,
          in our sole discretion.
        </Text>
        <Text style={styles.text}>
          5.2 Content of Others -: {universityName} does not control the Content
          of other members. When we become aware of inappropriate Content on our
          Platform, we reserve the right to investigate and take appropriate
          action, but we do not have any obligation to monitor, nor do we take
          responsibility for, the Content of other members.
        </Text>
        <Text style={styles.text}>
          5.3 Interactions with Others -: {universityName} is not a party to any
          offline arrangements made through our Platform. {universityName} does
          not conduct or require background checks on members and does not
          attempt to verify the truth or accuracy of statements made by members.
          {universityName} makes no representations or warranties concerning the
          conduct or Content of any members or their interactions with you.
        </Text>
        <Text style={styles.text}>
          5.4 No Resale -: Our Platform contains proprietary and confidential
          information and is protected by intellectual property laws. Unless we
          expressly permit it through this Agreement, you agree not to modify,
          reproduce, sell or charge a fee, offer to sell or charge a fee, make,
          create derivative works based on, or distribute any part of our
          Platform, including any data, or Content of others.
        </Text>
        <Text style={styles.text}>
          5.5 No Technical Interference with the Platform -: You agree that you
          will not engage in any activity or post any information or material
          that interferes with or disrupts, or that is designed to interfere
          with or disrupt, the Platform or any hardware used in connection with
          the Platform.
        </Text>
        <Text style={styles.text}>
          5.6 Platform Modifications -: We work hard to continuously improve our
          Platform. This means that we may modify or discontinue portions or all
          our Platform with or without notice and without liability to you or
          any third party.
        </Text>
        <Text style={styles.subtitle}>6.Release</Text>
        <Text style={styles.text}>
          You agree to release us and our officers, directors, shareholders,
          agents, employees, consultants, affiliates, subsidiaries, sponsors,
          and other third-party partners (referred to in this Agreement as “
          {universityName} Parties”) from claims, demands, and damages (direct
          and consequential) of every kind and nature, known and unknown, now
          and in the future (referred to in this Agreement as “Claims”), arising
          out of or in any way connected with any transaction with a third
          party, your interactions with other members, or in connection with a{" "}
          {universityName}
          group or a {universityName} event.{"\n"}You also agree to release
          organizers from Claims based on an organizer’s negligence arising out
          of or in any way connected with their Content, a {universityName}{" "}
          group, or a {universityName} event.{"\n"}You further waive all rights
          and benefits otherwise conferred by any statutory or non-statutory law
          of any jurisdiction that would purport to limit the scope of a release
          or waiver. You waive and relinquish all rights and benefits that you
          have or may have under any similar provision of statutory or
          non-statutory law of any other jurisdiction fully permitted by law.
        </Text>
        <Text style={styles.subtitle}>
          7. Warranty Disclaimer and Limitation of Liability
        </Text>
        <Text style={styles.text}>
          7.1 Warranty Disclaimer -: Our Platform is provided to you “as is” and
          on an “as available” basis. We disclaim all warranties and conditions
          of any kind, including but not limited to statutory warranties, and
          the implied warranties of merchantability, fitness for a purpose, and
          non-infringement. We also disclaim any warranties regarding (a) the
          reliability, timeliness, accuracy, and performance of our Platform,
          (b) any information, advice, services, or goods obtained through or
          advertised on our Platform or by us, as well as for any information or
          advice received through any links to other websites or resources
          provided through our Platform, (c) the results that may be obtained
          from the Platform, and (d) the correction of any errors in the
          Platform, (e) any material or data obtained through the use of our
          Platform, and (f) dealings with or as the result of the presence of
          marketing partners or other third parties on or located through our
          Platform.
        </Text>
        <Text style={styles.text}>
          7.2 Limitation of Liability -: You agree that in no event shall any
          {universityName} Parties be liable for any direct, indirect,
          incidental, special, or consequential damages, including but not
          limited to, damages for loss of profits, goodwill, use, data, or other
          intangible losses (even if any {universityName} Parties have been
          advised of the possibility of such damages) arising out of or in
          connection with (a) our Platform or this Agreement or the inability to
          use our Platform (however arising, including our negligence), (b)
          statements or conduct of or transactions with any member or third
          party on the Platform, (c) your use of our Platform or transportation
          to or from {universityName}
          events, attendance at {universityName} events, participation in or
          exclusion from {universityName} groups or {universityName} events and
          the actions of you or others at {universityName} events, or (d) any
          other matter relating to the Platform.
        </Text>
        <Text style={styles.subtitle}>8. Dispute Resolution</Text>
        <Text style={styles.text}>
          8.1 Informal Resolution -: Before making any claim, you and{" "}
          {universityName} agree to try to resolve any disputes through good
          faith discussions. We use the term “claim” to mean any dispute, claim
          or controversy arising out of or relating to your use of our Platform
          or this Agreement, including your participation in {universityName}{" "}
          events. You or {universityName} may initiate this process by sending
          written notice describing the dispute and your proposed resolution. If
          we cannot resolve the issue within 30 business days of receipt of the
          initial notice, you or {universityName} may bring a claim in
          accordance
        </Text>
        <Text style={styles.text}>
          8.2 Arbitration Agreement -: you agree to submit any claim for final
          and binding arbitration. In arbitration certain rights that you or we
          would have in court may not be available, such as discovery or appeal.
          You and {universityName} are each expressly waiving any right to trial
          by judge or jury in a court of law. This agreement to arbitrate shall
          apply regardless of whether the claim arises during or after any
          termination of this Agreement or your relationship with{" "}
          {universityName}.
        </Text>
        <Text style={styles.text}>
          8.3 Arbitration Time for Filing-:Any claim subject to arbitration must
          be filed within one year after the date the party asserting the claim
          first knows or should know of the act, omission or default giving rise
          to the claim, or the shortest time permitted by applicable law.
        </Text>
        <Text style={styles.text}>
          8.4 Arbitration Procedures-:Either party may commence arbitration by
          filing a written demand for arbitration with {universityName}, with a
          copy to the other party according to the notice procedures in Section
          10.1 The arbitration will be conducted in accordance with{" "}
          {universityName} Streamlined Arbitration Rules and Procedures and any
          other applicable rules that {universityName} requires (“
          {universityName} Rules”) in effect as of the demand for arbitration.
          You agree that arbitration law govern the interpretation and
          enforcement of these arbitration provisions. Any arbitration hearings
          can take place anywhere in the world.{"\n"}It isyour responsibility to
          pay any filing, administrative and arbitrator fees will be solely as
          set forth in the {universityName}
          Rules. The parties will cooperate with {universityName} and each other
          in scheduling the arbitration proceedings, and in selecting one
          arbitrator from the appropriate {universityName} list with substantial
          experience in resolving intellectual property and contract disputes.
          The arbitrator shall follow this Agreement and, to the extent
          permitted by {universityName} Rules, can award costs, fees and
          expenses, including attorneys’ fees to the prevailing party, except
          that the arbitrator shall not award declaratory or injunctive relief
          benefiting anyone but the parties to the arbitration. Judgment upon
          the award rendered by such arbitrator may be entered in any court of
          competent jurisdiction.
        </Text>
        <Text style={styles.text}>
          8.5 Exceptions -: You or {universityName} may assert claims, if they
          qualify, in small claims court, You or {universityName} may seek
          injunctive relief from a court of competent jurisdiction as necessary
          to protect the intellectual property rights of you or {universityName}
          pending the completion of arbitration.{"\n"}
          {universityName} may act in court or arbitration to collect any fees
          or recover damages for, or to seek injunctive relief relating to,
          Platform operations, or unauthorized use of our Platform or
          intellectual property. Nothing in this Section 9 shall diminish{" "}
          {universityName}’s right to modify, suspend or terminate your account
          or access to our Platform under Section 2.2.
        </Text>
        <Text style={styles.text}>
          8.6 Class Action Waiver -: You agree to resolve disputes with{" "}
          {universityName} on an individual basis. You agree not to bring a
          claim as a plaintiff or a class member in a class, consolidated or
          representative action. You are expressly waiving any right to
          participate in class actions, class arbitrations, private attorney
          general actions and consolidation with other arbitrations.
        </Text>
        <Text style={styles.subtitle}>9. Intellectual Property</Text>
        <Text style={styles.text}>
          9.1 Intellectual Propertyof {universityName} -: {universityName}{" "}
          trademarks, logos, service marks, and service names are the
          intellectual property of {universityName}. Our Trademark Usage
          Guidelines explain how you may and may not use them. Our Platform,
          including our material on the Platform, are also our or our licensors’
          intellectual property, and as otherwise permitted by law, you agree
          not to use our intellectual property without our prior written
          consent.
        </Text>
        <Text style={styles.text}>
          9.2 Intellectual Property of Others -: {universityName} respects the
          intellectual property of others, and we expect our members to do the
          same. We may, in appropriate circumstances and in our discretion,
          remove or disable access to material that infringes on the
          intellectual property rights of others. We may also restrict or
          terminate access to our Platform to those who we believe to be repeat
          infringers. If you believe your intellectual property rights have been
          violated, please review our Intellectual Property Dispute Policies.
        </Text>
        <Text style={styles.subtitle}>10. Other Stuff</Text>
        <Text style={styles.text}>
          10.1 Notices -: Except as otherwise stated in this Agreement or as
          expressly required by law, any notice to us shall be given by
          certified postal mail to a given address, or by email to legal@
          {universityName}.com. Any notice to you shall be given to the most
          current email address in your account.
        </Text>
        <Text style={styles.text}>
          10.2 Termination-: If we terminate your account or access to our
          Platform, this Agreement terminates with respect to the member account
          that has been terminated. However, certain provisions of this
          Agreement that by their nature survive termination
        </Text>
        <Text style={styles.text}>
          10.3 Violations -: Please report any violations of this Agreement by a
          member or third party by sending an email to abuse@{universityName}
          .com
        </Text>
        <Text style={styles.text}>
          10.4 Thank you -: Please accept our wholehearted thanks for reading
          our Terms of Service.
        </Text>
        <View style={{ marginTop: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TermsScreen;
const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      // flexGrow: 1,
      paddingHorizontal: 16,
      paddingVertical: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 12,
      color: colors.textColor,
    },
    subtitle: {
      fontSize: 18,
      fontWeight: "600",
      marginTop: 16,
      marginBottom: 8,
      color: colors.textColor,
    },
    subsection: {
      fontSize: 16,
      fontWeight: "500",
      marginTop: 10,
      marginBottom: 6,
      color: colors.textColor,
    },
    text: {
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 10,
      color: colors.textColor,
      // color: '#333',
    },
  });
