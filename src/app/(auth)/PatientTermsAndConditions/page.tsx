'use client';

import React, { useState } from 'react';

const termsTexts = {
  en: (
    <>
      <h1 className="text-2xl font-bold text-center mb-4">Terms and Conditions</h1>

      <section>
        <h2 className="font-semibold text-lg">1. Terms of Payment</h2>
        <p>
          a. <strong>Invoices are payable upon receipt:</strong> I have requested home healthcare service from Curate Health and understand that by making this request, I become fully financially responsible for any and all charges incurred in the course of the care authorised or services rendered. I further understand that fees are due and payable as set forth herein.
        </p>
        <p>
          Invoices are prepared on a monthly basis or as required. There will be an annual increment of ten percent on service to meet the market requirements. Invoices are shared with the Client on 1st of every month, payments are expected within 7 days from the invoice date. Curate Health reserves the right to apply a late fee of Rs 500/- for the next 5 days and continue further if payment is not received. Cash or cheque collection charges apply. Online payments are encouraged.
        </p>
        <p>
          b. <strong>Service charges and modifications:</strong> Charges are based on current service requirements outlined in the Plan of Care. Any change in condition requiring plan modification will lead to a rate adjustment with 7 days written notice before it takes effect.
        </p>
        <p>
          c. <strong>Leaves:</strong> Healthcare Professionals are entitled to emergency, sick, and scheduled leaves as per contract. Curate Health provides replacements based on availability and informs the client in advance. Billing is adjusted accordingly.
        </p>
        <p>
          d. <strong>Stay duty:</strong> The client agrees to provide food, space, and accommodation to Healthcare Professionals staying on premises. This is separate from professional charges.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">2. Termination of Service Agreement</h2>
        <p>
          a. <strong>By Client:</strong> Clients may change or terminate service with a minimum 5 days’ notice. Without notice, clients are subject to 5 days compensation. All notices must be in writing via email to <a className="text-blue-600" href="mailto:info@curatehealth.in">info@curatehealth.in</a>.
        </p>
        <p>
          b. <strong>By Curate Health:</strong> We may terminate service with 5 days written notice under these conditions:
        </p>
        <ul className="list-disc ml-6">
          <li>Unsafe or inadequate arrangements at client home</li>
          <li>Unpaid service charges</li>
          <li>Lack of personnel/resources</li>
          <li>Non-cooperation from client or representatives</li>
          <li>No family member present for emergency situations</li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold text-lg">3. Valuables</h2>
        <p>
          Healthcare Professionals are not permitted to handle or use client valuables including cash, bank cards, or checks. Any suspicion of theft must be reported with proof. Legal steps can be taken and Curate will support with necessary details but is not liable for individual actions.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">4. Healthcare Professional Safety & Accommodation</h2>
        <p>
          Domestic violence, abuse, or verbal assault are strictly discouraged. Clients must provide three meals and a hygienic space. Exceptions are to be documented.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">5. Contractor Clause</h2>
        <p>
          Healthcare Professionals are independent contractors. Curate Health facilitates services but is not liable for disputes between clients and professionals, including any fraudulent activity.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">6. Dispute Resolution</h2>
        <p>
          This agreement is governed by the laws of Telangana, India. All disputes will be addressed under Hyderabad jurisdiction.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">7. Non-Solicitation Agreement</h2>
        <p>
          Clients agree not to solicit or hire Curate Health professionals during the service period and for 12 months after termination. Violations will result in liquidated damages and legal action. All legal fees shall be borne by the client in such cases.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">8. Consent</h2>
        <p>
          By entering this agreement, you confirm understanding and agreement with all terms. Consent may be revoked in writing for future services.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">9. Service Communication and Complaints</h2>
        <p>
          A Healthcare Manager will be assigned. For concerns or feedback, email <a className="text-blue-600" href="mailto:info@curatehealth.in">info@curatehealth.in</a>.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">Account Details</h2>
        <p>
          <strong>A/C Name:</strong> Curate Health Services<br />
          <strong>Account Number:</strong> 01140210002278<br />
          <strong>IFSC Code:</strong> UCBA0000114<br />
          <strong>UPI ID:</strong> curateservices@ucobank
        </p>
        <p>Please share payment reference with Curate staff or email to <a className="text-blue-600" href="mailto:info@curatehealth.in">info@curatehealth.in</a>.</p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">Client Consent</h2>
        <p>
          I understand that a Curate Health representative will visit my home to facilitate the service. I have read and understood the above terms and consent to cooperate. I may revoke consent at any time by written request, excluding actions already taken.
        </p>
      </section>
    </>
  ),

  te: (
    <>
      <h1 className="text-2xl font-bold text-center mb-4">నియమాలు మరియు షరతులు</h1>

      <section>
        <h2 className="font-semibold text-lg">1. చెల్లింపు నిబంధనలు</h2>
        <p>
          a. <strong>ఒప్పందాలపై చెల్లింపులు వెంటనే చేయాలి:</strong> కరేట్ హెల్త్ నుండి హోమ్ హెల్త్‌కేర్ సేవ కోరాను, ఈ అభ్యర్థనతో నేను ఆమోదించిన లేదా అందించిన సేవలలో కలిగే అన్ని ఖర్చులకు పూర్తిగా ఆర్థిక బాధ్యుడిని అవుతానని అర్థం చేసుకున్నాను. ఫీజులు ఇక్కడ పేర్కొన్న విధంగా చెల్లించాలి అని కూడా నేను అర్థం చేసుకున్నాను.
        </p>
        <p>
          ఇన్వాయిసులు నెలకు ఒకసారి లేదా అవసరం ఉన్నప్పుడల్లా తయారుచేస్తారు. మార్కెట్ అవసరాలకు తగినపడి సర్వీసుపై సంవత్సరానికి పది శాతం వృద్ధి ఉంటుంది. ఇన్వాయిసులను ప్రతి నెల 1వ తేదీన క్లయింట్‌కు పంపిస్తారు, ఇన్వాయిస్ తేదీ నుండి 7 రోజుల్లో చెల్లింపులు చేయాలి. చెల్లింపు అందకపోతే వచ్చే 5 రోజులకు రూ. 500/- ఆలస్య రుసుము అనువర్తించబడుతుంది మరియు తదుపరి కూడా అనువర్తించవచ్చు. నగదు లేక చెక్ ఈటడానికి చార్జీలు ఉన్నాయి. ఆన్‌లైన్ చెల్లింపులు ప్రోత్సహించబడును.
        </p>
        <p>
          b. <strong>సేవా చార్జీలు మరియు మార్పులు:</strong> చార్జీలు ప్రస్తుత సేవా అవసరాల ఆధారంగా ప్లాన్ ఆఫ్ కేర్ లో వివరించబడతాయి. పరిస్థితుల్లో మార్పు వల్ల ప్లాన్ మార్పులు అవసరమయ్యే సందర్భాల్లో 7 రోజులు ముందస్తు లిఖిత నోటీసుతో రేటు సవరించబడుతుంది.
        </p>
        <p>
          c. <strong>లవ్‌లు:</strong> ఆరోగ్య కార్మికులకు ఒప్పంద ప్రకారం అత్యవసర, అనారోగ్య, షెడ్యూల్ లవ్‌లు ఉండే హక్కు ఉంది. కరేట్ హెల్త్ అందుబాటులో ఉన్నవారిని రీప్లేస్ చేస్తుంది మరియు క్లయింట్‌కు ముందస్తుగా సమాచారం ఇస్తుంది. బిల్లింగ్ అనుగుణంగా సవరించబడుతుంది.
        </p>
        <p>
          d. <strong>స్టే డ్యూటీ:</strong> క్లయింట్ వ్యవస్థలో ఉన్న ఆరోగ్య కార్మికులకు భోజనం, స్థలం, మరియు వసతి అందించాలనుకుంటున్నారు. ఇది ప్రొఫెషనల్ చార్జీలకు వేరుగా ఉంటుంది.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">2. సేవా ఒప్పందం ముగింపు</h2>
        <p>
          a. <strong>క్లయింట్ ద్వారా:</strong> క్లయింట్లు కనీసం 5 రోజుల నోటీసుతో సేవను మార్చుకోవచ్చు లేదా రద్దు చేయవచ్చు. నోటీసు లేకుండా 5 రోజుల పరిహారం చెల్లించవలసి ఉంటుంది. అన్ని నోటీసులు ఇమెయిల్ ద్వారా లిఖిత రూపంలో <a className="text-blue-600" href="mailto:info@curatehealth.in">info@curatehealth.in</a> కు ఇవ్వాలి.
        </p>
        <p>
          b. <strong>కరేట్ హెల్త్ ద్వారా:</strong> ఈ పరిస్థితుల్లో 5 రోజుల లిఖిత నోటీసుతో సేవను రద్దు చేయవచ్చు:
        </p>
        <ul className="list-disc ml-6">
          <li>క్లయింట్ ఇంట్లో అప్రమత్త లేదా తగిన వాతావరణం లేకపోవడం</li>
          <li>బాకీ ఉన్న సేవా చార్జీలు</li>
          <li>సిబ్బంది లేదా వనరుల లోపం</li>
          <li>క్లయింట్ లేదా ప్రతినిధుల నుండి సహకారం లేకపోవడం</li>
          <li>అత్యవసర పరిస్థితుల కోసం కుటుంబ సభ్యుడు అందుబాటులో లేకపోవడం</li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold text-lg">3. విలువైన వస్తువులు</h2>
        <p>
          ఆరోగ్య కార్మికులు క్లయింట్ యొక్క నగదు, బ్యాంక్ కార్డులు లేదా చెక్కులను నిర్వహించడానికి లేదా ఉపయోగించడానికి అనుమతించబడరు. దొంగతనంపై అనుమానం ఉన్నట్లయితే, అదే నిరూపింపు తో రిపోర్ట్ చేయాలి. చట్టపరంగా చర్యలు తీసుకోవచ్చు మరియు కరేట్ అవసరమైన వివరాలతో సహాయం చేస్తుంది, కానీ వ్యక్తిగత చర్యలకు బాధ్యుడు కాదు.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">4. ఆరోగ్య కార్మికుల సురక్షత & వసతి</h2>
        <p>
          గృహహింస, దుర్వినియోగం లేదా మౌఖిక దాడులను తీవ్రంగా నిరోధించాలి. క్లయింట్లు మూడు భోజనాలు మరియు శుభ్రత కలిగిన ప్రదేశాన్ని అందించాలి. మినహాయింపులను లిఖిత రూపంలో నమోదు చేయాలి.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">5. కాంట్రాక్టర్ నిబంధన</h2>
        <p>
          ఆరోగ్య కార్మికులు స్వతంత్ర కాంట్రాక్టర్లు. కరేట్ హెల్త్ సేవలను సమకూర్చుతుంది కాని క్లయింట్లు మరియు కార్మికుల మధ్య తగాదాలపై, మోసపూరిత కార్యకలాపాలపై బాధ్యుడు కాదు.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">6. వివాద పరిష్కారం</h2>
        <p>
          ఈ ఒప్పందం తెలంగాణా, భారతీయ చట్టాల కిందనుంచి నడిపించబడుతుంది. అన్ని వివాదాలను హైదరాబాద్ ప్రాంతీయ చట్ట పరిధిలో పరిష్కరించబడతాయి.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">7. నాన్-సోలిసిటేషన్ ఒప్పందం</h2>
        <p>
          క్లయింట్లు సేవా కాలంలో మరియు సేవ ముగిసిన 12 నెలల పాటు కరేట్ హెల్త్ సంస్థ కార్మికులను వేధించడం లేదా నియమించడం చేయము. దీనిని ఉల్లంఘిస్తే ద్రవీభవించు నష్టపరిహారం మరియు చట్టపరమైన చర్యలు తీసుకోబడి, అన్ని చట్టఖర్చులు క్లయింట్ భరిస్తారు.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">8. అంగీకారం</h2>
        <p>
          ఈ ఒప్పందంలో ప్రవేశించడం ద్వారా, మీరు అన్ని నిబంధనలను అర్థం చేసుకుని అంగీకరిస్తున్నారని ధృవీకరిస్తారు. భవిష్యత్ సేవల కోసం ఎప్పుడైనా లిఖిత రూపంలో అంగీకారాన్ని రద్దు చేయవచ్చు.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">9. సేవా సంబంధ కమ్యూనికేషన్ మరియు ఫిర్యాదులు</h2>
        <p>
          ఒక ఆరోగ్య మేనేజర్ నియమించబడతాడు. సమస్యలు లేదా అభిప్రాయాల కోసం, ఇమెయిల్ చేయండి <a className="text-blue-600" href="mailto:info@curatehealth.in">info@curatehealth.in</a>.
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">అక్కౌంట్ వివరాలు</h2>
        <p>
          <strong>ఖాతా పేరు:</strong> కరేట్ హెల్త్ సర్వీసెస్<br />
          <strong>ఖాతా సంఖ్య:</strong> 01140210002278<br />
          <strong>IFSC కోడ్:</strong> UCBA0000114<br />
          <strong>UPI ID:</strong> curateservices@ucobank
        </p>
        <p>చెల్లింపు రిఫరెన్స్‌ను కరేట్ సిబ్బంది లేదా <a className="text-blue-600" href="mailto:info@curatehealth.in">info@curatehealth.in</a> వద్ద పంచుకోండి.</p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">క్లయింట్ అంగీకారం</h2>
        <p>
          సేవను సులభతరం చేసేందుకు కరేట్ హెల్త్ ప్రతినిధి నా ఇంటికి వస్తారని నేను అర్థం చేసుకున్నాను. పై నిబంధనలను చదివి అర్థం చేసుకుని సహకరించడానికి అంగీకరించాను. రాస్తువార్త ద్వారా, నేను ఈ అంగీకారాన్ని ఎప్పుడైనా రద్దు చేయవచ్చు, అయితే ఇప్పటికే చేపట్టిన చర్యలు తప్పుతుంది.
        </p>
      </section>
    </>
  ),

  hi: (
    <>
      <h1 className="text-2xl font-bold text-center mb-4">नियम और शर्तें</h1>

      <section>
        <h2 className="font-semibold text-lg">1. भुगतान की शर्तें</h2>
        <p>
          a. <strong>चालान प्राप्त होने पर भुगतान करना होगा:</strong> मैंने क्यूरेट हेल्थ से होम हेल्थकेयर सेवा के लिए अनुरोध किया है और समझता हूँ कि इस अनुरोध के साथ, मैं स्वीकृत देखभाल या प्रदान की गई सेवाओं के दौरान हुए सभी शुल्कों के लिए पूरी तरह वित्तीय जिम्मेदार हूँ। मैं यह भी समझता हूँ कि शुल्क इस दस्तावेज़ में निर्दिष्ट अनुसार देय और भुगतान योग्य हैं।
        </p>
        <p>
          चालान मासिक रूप से या आवश्यकता अनुसार तैयार किए जाते हैं। बाजार की आवश्यकताओं को पूरा करने के लिए सेवा पर प्रति वर्ष दस प्रतिशत वृद्धि होगी। चालान हर महीने 1 तारीख को ग्राहक को भेजे जाते हैं, चालान की तारीख से 7 दिन के भीतर भुगतान अपेक्षित है। यदि भुगतान समय पर प्राप्त नहीं होता है, तो क्यूरेट हेल्थ अगली 5 दिनों के लिए ₹500/- का विलंब शुल्क लागू करने का अधिकार सुरक्षित रखते हैं और यदि भुगतान जारी रहता है तो आगे भी लागू कर सकते हैं। नकद या चेक संग्रह शुल्क लागू होते हैं। ऑनलाइन भुगतान प्रोत्साहित किए जाते हैं।
        </p>
        <p>
          b. <strong>सेवा शुल्क और संशोधन:</strong> शुल्क वर्तमान सेवा आवश्यकताओं के आधार पर योजना के अनुरूप तय किए जाते हैं। यदि स्थिति में परिवर्तन के कारण योजना संशोधन आवश्यक होता है, तो 7 दिन पहले लिखित सूचना के साथ दर समायोजित की जाएगी।
        </p>
        <p>
          c. <strong>छुट्टियाँ:</strong> स्वास्थ्य पेशेवरों को अनुबंध के अनुसार आपातकालीन, बीमारी और अनुसूचित छुट्टियों का अधिकार होता है। क्यूरेट हेल्थ उपलब्धता के आधार पर प्रतिस्थापन प्रदान करता है और ग्राहक को पूर्व सूचना देता है। बिलिंग उसी अनुसार समायोजित की जाती है।
        </p>
        <p>
          d. <strong>रुकने की जिम्मेदारी:</strong> ग्राहक स्वास्थ्य पेशेवरों को सेवा स्थल पर रहने के लिए भोजन, स्थान और आवास प्रदान करने के लिए सहमत होते हैं। यह पेशेवर शुल्क से अलग है।
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">2. सेवा अनुबंध समाप्ति</h2>
        <p>
          a. <strong>ग्राहक द्वारा:</strong> ग्राहक कम से कम 5 दिनों के नोटिस पर सेवा को बदल या समाप्त कर सकते हैं। बिना नोटिस के ग्राहक को 5 दिनों का मुआवजा देना होगा। सभी सूचनाएं लिखित रूप में ईमेल द्वारा <a className="text-blue-600" href="mailto:info@curatehealth.in">info@curatehealth.in</a> पर होनी चाहिए।
        </p>
        <p>
          b. <strong>क्यूरेट हेल्थ द्वारा:</strong> निम्न परिस्थितियों में 5 दिनों के लिखित नोटिस पर सेवा समाप्त की जा सकती है:
        </p>
        <ul className="list-disc ml-6">
          <li>ग्राहक के घर में असुरक्षित या अनुपयुक्त व्यवस्था</li>
          <li>अवैतनिक सेवा शुल्क</li>
          <li>कर्मचारी/संसाधनों की कमी</li>
          <li>ग्राहक या प्रतिनिधियों का असहयोग</li>
          <li>आपातकालीन स्थिति के लिए कोई परिवार सदस्य उपस्थित न होना</li>
        </ul>
      </section>

      <section>
        <h2 className="font-semibold text-lg">3. कीमती सामान</h2>
        <p>
          स्वास्थ्य पेशेवरों को ग्राहक के कीमती सामान जैसे नगद, बैंक कार्ड या चेक संभालने या उपयोग करने की अनुमति नहीं है। चोरी का संदेह होने पर प्रमाण के साथ रिपोर्ट करना आवश्यक है। कानूनी कार्रवाई की जा सकती है और क्यूरेट आवश्यक विवरणों के साथ सहायता करेगा, लेकिन व्यक्तिगत कार्यों के लिए जिम्मेदार नहीं है।
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">4. स्वास्थ्य पेशेवर की सुरक्षा और आवास</h2>
        <p>
          घरेलू हिंसा, अपमान या मौखिक हमले को कड़ाई से रोकना चाहिए। ग्राहकों को तीन समय का भोजन और स्वच्छ जगह प्रदान करनी होगी। अपवादों का दस्तावेजीकरण किया जाना चाहिए।
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">5. ठेकेदार क्लॉज</h2>
        <p>
          स्वास्थ्य पेशेवर स्वतंत्र ठेकेदार हैं। क्यूरेट हेल्थ सेवाओं में सुविधा प्रदान करता है, लेकिन ग्राहकों और पेशेवरों के बीच विवादों और किसी भी धोखाधड़ी के लिए उत्तरदायी नहीं है।
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">6. विवाद समाधान</h2>
        <p>
          यह अनुबंध तेलंगाना, भारत के कानूनों के अनुसार लागू होगा। सभी विवाद हैदराबाद के क्षेत्राधिकार के अंतर्गत होंगे।
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">7. गैर-भर्ती समझौता</h2>
        <p>
          ग्राहक सेवा अवधि के दौरान और समाप्ति के 12 महीनों तक क्यूरेट हेल्थ के पेशेवरों को भर्ती या प्रलोभन नहीं देंगे। उल्लंघन की स्थिति में द्रवित हानि और कानूनी कार्रवाई होगी। ऐसे मामलों में सभी कानूनी शुल्क ग्राहक द्वारा वहन किए जाएंगे।
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">8. सहमति</h2>
        <p>
          इस समझौते में प्रवेश करके, आप सभी शर्तों को समझने और स्वीकार करने की पुष्टि करते हैं। भविष्य की सेवाओं के लिए सहमति को लिखित रूप में वापस लिया जा सकता है।
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">9. सेवा संवाद और शिकायतें</h2>
        <p>
          एक हेल्थकेयर मैनेजर नियुक्त किया जाएगा। चिंताओं या प्रतिक्रिया के लिए, कृपया ईमेल करें <a className="text-blue-600" href="mailto:info@curatehealth.in">info@curatehealth.in</a>।
        </p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">खाता विवरण</h2>
        <p>
          <strong>खाते का नाम:</strong> Curate Health Services<br />
          <strong>खाता संख्या:</strong> 01140210002278<br />
          <strong>IFSC कोड:</strong> UCBA0000114<br />
          <strong>UPI ID:</strong> curateservices@ucobank
        </p>
        <p>कृपया भुगतान संदर्भ क्यूरेट स्टाफ या ईमेल पर साझा करें <a className="text-blue-600" href="mailto:info@curatehealth.in">info@curatehealth.in</a>.</p>
      </section>

      <section>
        <h2 className="font-semibold text-lg">ग्राहक सहमति</h2>
        <p>
          मुझे समझ है कि क्यूरेट हेल्थ का प्रतिनिधि सेवा सुविधा के लिए मेरे घर आएगा। मैंने उपरोक्त शर्तों को पढ़ लिया है और समझ लिया है और सहयोग के लिए सहमत हूँ। मैं लिखित अनुरोध द्वारा कभी भी सहमति वापस ले सकता हूँ, पहले से लिए गए कार्यों को छोड़कर।
        </p>
      </section>
    </>
  ),
};

export default function TermsAndConditions  ()  {
  const [language, setLanguage] = useState<'en' | 'te' | 'hi'>('en');

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 text-justify text-sm leading-relaxed">
  
      <div className="mb-6 flex justify-end">
        <label htmlFor="language-select" className="mr-2 font-semibold">
          Language:
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value as 'en' | 'te' | 'hi')}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="en">English</option>
          <option value="te">Telugu</option>
          <option value="hi">Hindi</option>
        </select>
      </div>


      {termsTexts[language]}
    </div>
  );
};


